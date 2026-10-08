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

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

// Tried in order when the main model is overloaded or unavailable
const FALLBACK_MODELS = ['gemini-2.5-flash'];
const MODELS = [GEMINI_MODEL, ...FALLBACK_MODELS.filter((m) => m !== GEMINI_MODEL)];

// NEXT_PUBLIC_GEMINI_API_KEY is still read so existing deployments keep working,
// but it is only ever used here on the server. Prefer GEMINI_API_KEY.
function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
}

// Wait before retrying a busy model once; kept short to fit the route's 60s limit
const RETRY_DELAY_MS = 2000;

const errorStatus = (err: unknown): unknown =>
  typeof err === 'object' && err !== null && 'status' in err ? (err as { status: unknown }).status : undefined;

// 503 "high demand" and 429 rate limits are usually gone within seconds
const isTemporaryGeminiError = (err: unknown): boolean => [503, 429].includes(errorStatus(err) as number);

// Worth trying the next model: busy, or this model was retired (404)
const shouldTryNextModel = (err: unknown): boolean => isTemporaryGeminiError(err) || errorStatus(err) === 404;

/**
 * Sends the prompt to each model in MODELS until one answers, retrying a busy model once.
 * Returns the text and the model that produced it; rethrows the last error if all fail.
 */
async function generateWithFallback(
  apiKey: string,
  prompt: string,
  generationConfig?: Record<string, unknown>,
): Promise<{ text: string; model: string }> {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: unknown;

  for (const modelName of MODELS) {
    const model = genAI.getGenerativeModel({ model: modelName, generationConfig });
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await model.generateContent(prompt);
        return { text: response.response.text(), model: modelName };
      } catch (err) {
        lastError = err;
        if (!shouldTryNextModel(err)) throw err;
        if (attempt === 0 && isTemporaryGeminiError(err)) {
          console.warn(`[gemini] ${modelName} busy, retrying`);
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
          continue;
        }
        console.warn(`[gemini] ${modelName} unavailable, trying next model`);
        break;
      }
    }
  }
  throw lastError;
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

  const prompt = buildAnalysisPrompt(text, contractType, perspective, preferredLanguage, truncated);
  let raw: string;
  let usedModel: string;
  try {
    // Ask Gemini for raw JSON so the response doesn't need fence-stripping or guesswork
    ({ text: raw, model: usedModel } = await generateWithFallback(apiKey, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.2,
    }));
  } catch (err) {
    console.error('[analyzeContract] Gemini call failed:', err);
    throw new AnalysisError(
      isTemporaryGeminiError(err)
        ? 'The AI service is very busy right now. Please try again in a minute.'
        : 'The AI service could not analyse this document right now. Please try again in a minute.',
      isTemporaryGeminiError(err) ? 503 : 502,
    );
  }

  const result = normalizeAnalysis(repairJSON(raw), { contractType, perspective });
  if (!result) {
    console.error('[analyzeContract] Unusable AI response:', raw.slice(0, 500));
    throw new AnalysisError('The AI returned an incomplete analysis. Please try again.');
  }

  return { result, model: usedModel, truncated };
}

/** Returns an AI-generated tip, or null if the AI isn't configured or the call fails. */
export async function generateLegalTip(): Promise<string | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  try {
    const prompt = `You are NyaySaathi, an AI legal assistant specialised in Indian contract law.

Generate exactly ONE practical legal tip for someone reviewing or signing contracts in India today.
The tip should be:
- Specific to Indian law (mention relevant acts, sections, or Indian court trends where helpful)
- Actionable and immediately useful
- 1–2 sentences max (under 60 words)
- Written in plain English (no legalese)
- Start with a relevant emoji

Respond with ONLY the tip text — no title, no label, no extra text.`;

    const tip = (await generateWithFallback(apiKey, prompt)).text.trim();

    // Safety: reject anything that doesn't look like a short tip
    if (tip.length < 20 || tip.length > 400) return null;
    return tip;
  } catch (err) {
    console.warn('[generateLegalTip] Gemini call failed:', err);
    return null;
  }
}
