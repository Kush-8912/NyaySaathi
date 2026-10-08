// SERVER ONLY. Imported by the /api route handlers, never by client components,
// so the Gemini API key is never sent to the browser.
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIAnalysisResult } from '@/types/analysis';
import type { AIRequestOptions } from '@/types/ai';
import { MAX_TEXT_CHARS } from '@/lib/constants';
import { buildAnalysisPrompt } from './prompts';
import { repairJSON } from './jsonRepair';
import { getAnalysisText } from './chunking';
import { normalizeAnalysis } from './normalize';

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// NEXT_PUBLIC_GEMINI_API_KEY is still read so existing deployments keep working,
// but it is only ever used here on the server. Prefer GEMINI_API_KEY.
function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
}

/** An error whose message is safe to show to the user, with the HTTP status to return. */
export class AnalysisError extends Error {
  constructor(message: string, public status = 502) {
    super(message);
  }
}

export async function analyzeContract(
  options: AIRequestOptions,
): Promise<{ result: AIAnalysisResult; model: string; truncated: boolean }> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new AnalysisError('AI analysis is not configured on the server yet.', 503);
  }

  const { contractType, perspective, preferredLanguage } = options;
  const { text, truncated } = getAnalysisText(options.contractText, MAX_TEXT_CHARS);

  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: GEMINI_MODEL,
    // Ask Gemini for raw JSON so the response doesn't need fence-stripping or guesswork
    generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
  });

  let raw: string;
  try {
    const response = await model.generateContent(
      buildAnalysisPrompt(text, contractType, perspective, preferredLanguage, truncated),
    );
    raw = response.response.text();
  } catch (err) {
    console.error('[analyzeContract] Gemini call failed:', err);
    throw new AnalysisError('The AI service could not analyse this document right now. Please try again in a minute.');
  }

  const result = normalizeAnalysis(repairJSON(raw), { contractType, perspective });
  if (!result) {
    console.error('[analyzeContract] Unusable AI response:', raw.slice(0, 500));
    throw new AnalysisError('The AI returned an incomplete analysis. Please try again.');
  }

  return { result, model: GEMINI_MODEL, truncated };
}

/** Returns an AI-generated tip, or null if the AI isn't configured or the call fails. */
export async function generateLegalTip(): Promise<string | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  try {
    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: GEMINI_MODEL });
    const prompt = `You are NyaySaathi, an AI legal assistant specialised in Indian contract law.

Generate exactly ONE practical legal tip for someone reviewing or signing contracts in India today.
The tip should be:
- Specific to Indian law (mention relevant acts, sections, or Indian court trends where helpful)
- Actionable and immediately useful
- 1–2 sentences max (under 60 words)
- Written in plain English (no legalese)
- Start with a relevant emoji

Respond with ONLY the tip text — no title, no label, no extra text.`;

    const response = await model.generateContent(prompt);
    const tip = response.response.text().trim();

    // Safety: reject anything that doesn't look like a short tip
    if (tip.length < 20 || tip.length > 400) return null;
    return tip;
  } catch (err) {
    console.warn('[generateLegalTip] Gemini call failed:', err);
    return null;
  }
}
