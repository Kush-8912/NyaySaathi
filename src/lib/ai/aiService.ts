import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIAnalysisResult } from '@/types/analysis';
import type { AIRequestOptions } from '@/types/ai';
import { buildAnalysisPrompt } from './prompts';
import { repairJSON } from './jsonRepair';
import { getAnalysisText } from './chunking';
import { getMockAnalysis } from './mockResponses';

const genAI = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
  : null;

export type AnalysisProgressCallback = (step: string, message: string) => void;

export async function analyzeContract(
  options: AIRequestOptions,
  onProgress?: AnalysisProgressCallback,
): Promise<{ result: AIAnalysisResult; usedMock: boolean }> {
  const { contractText, contractType, perspective, preferredLanguage } = options;
  const safeText = getAnalysisText(contractText, 12000);

  const steps = [
    { key: 'extract', msg: 'Extracting legal clauses...' },
    { key: 'classify', msg: 'Classifying risk categories...' },
    { key: 'adversarial', msg: 'Running adversarial reasoning...' },
    { key: 'explain', msg: 'Generating plain language explanations...' },
    { key: 'negotiate', msg: 'Building negotiation plan...' },
    { key: 'report', msg: 'Compiling risk report...' },
  ];

  // Simulate progress for UX even during real AI call
  let stepIdx = 0;
  const progressInterval = setInterval(() => {
    if (stepIdx < steps.length && onProgress) {
      onProgress(steps[stepIdx].key, steps[stepIdx].msg);
      stepIdx++;
    }
  }, 1200);

  try {
    if (!genAI) throw new Error('Gemini API key not configured');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = buildAnalysisPrompt(safeText, contractType, perspective, preferredLanguage);

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    clearInterval(progressInterval);
    if (onProgress) onProgress('report', 'Compiling risk report...');

    const parsed = repairJSON(text) as AIAnalysisResult | null;
    if (parsed && parsed.clauseAnalyses && parsed.overallRiskScore !== undefined) {
      return { result: parsed, usedMock: false };
    }

    // Parsed but incomplete — augment with mock structure
    console.warn('AI returned incomplete JSON, using mock fallback');
    return { result: getMockAnalysis(contractType), usedMock: true };
  } catch (err) {
    clearInterval(progressInterval);
    if (onProgress) onProgress('report', 'Using demo analysis...');
    console.error('AI analysis failed:', err);
    return { result: getMockAnalysis(contractType), usedMock: true };
  }
}

// ─── Legal Tip of the Day ────────────────────────────────────────────────────

const FALLBACK_TIPS = [
  '🔍 Non-compete clauses over 12 months are often unenforceable in India — always check the duration.',
  '⚖️ One-sided arbitration clauses — where one party picks the arbitrator — are a major red flag. Negotiate.',
  '💡 IP clauses covering "ideas conceived outside work hours" are increasingly challenged in Indian courts.',
  '🔐 Auto-renewal clauses with 30+ day notice windows are a common trap. Flag them before signing.',
  '📝 Missing termination-for-cause definitions? That leaves you exposed to arbitrary firing.',
];

export async function fetchLegalTip(): Promise<string> {
  if (!genAI) {
    return FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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

    // Safety: if the response looks malformed return a fallback
    if (!tip || tip.length < 20 || tip.length > 400) {
      throw new Error('Unexpected tip format');
    }
    return tip;
  } catch (err) {
    console.warn('fetchLegalTip failed, using fallback:', err);
    return FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
  }
}
