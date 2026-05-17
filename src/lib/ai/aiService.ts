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

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
