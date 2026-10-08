'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase/auth';
import { saveAnalysis, logActivity, saveAILog } from '@/lib/firebase/firestore';
import type { AIAnalysisResult, StoredAnalysis } from '@/types/analysis';

interface RunOptions {
  uid: string;
  contractText: string;
  contractType: string;
  perspective: string;
  preferredLanguage: string;
  fileName?: string;
}

interface UseAIAnalysisResult {
  analyzing: boolean;
  currentStep: string;
  currentMessage: string;
  result: AIAnalysisResult | null;
  savedId: string | null;
  truncated: boolean;
  error: string | null;
  run: (opts: RunOptions) => Promise<string | null>;
  reset: () => void;
}

// The analysis is a single AI call; these steps only animate progress while it runs
const PROGRESS_STEPS = [
  { key: 'extract', msg: 'Extracting legal clauses...' },
  { key: 'classify', msg: 'Classifying risk categories...' },
  { key: 'adversarial', msg: 'Running adversarial reasoning...' },
  { key: 'explain', msg: 'Generating plain language explanations...' },
  { key: 'negotiate', msg: 'Building negotiation plan...' },
  { key: 'report', msg: 'Compiling risk report...' },
];

interface AnalyzeResponse {
  result?: AIAnalysisResult;
  model?: string;
  truncated?: boolean;
  error?: string;
}

export function useAIAnalysis(): UseAIAnalysisResult {
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (opts: RunOptions) => {
    setAnalyzing(true);
    setError(null);
    setResult(null);
    setSavedId(null);
    setTruncated(false);

    // Advance through the steps, then hold on the last one until the AI responds
    let stepIdx = 0;
    const showStep = () => {
      const step = PROGRESS_STEPS[Math.min(stepIdx, PROGRESS_STEPS.length - 1)];
      setCurrentStep(step.key);
      setCurrentMessage(step.msg);
      stepIdx++;
    };
    showStep();
    const progressInterval = setInterval(showStep, 2500);

    try {
      const currentUser = auth.current.currentUser;
      if (!currentUser) throw new Error('Your session has expired. Please sign in again.');
      const idToken = await currentUser.getIdToken();

      // The Gemini call happens on the server (src/app/api/analyze/route.ts) so the API key stays secret
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({
          contractText: opts.contractText,
          contractType: opts.contractType,
          perspective: opts.perspective,
          preferredLanguage: opts.preferredLanguage,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as AnalyzeResponse;

      if (!res.ok || !data.result) {
        throw new Error(data.error || 'Analysis failed. Please try again.');
      }

      const aiResult = data.result;
      setResult(aiResult);
      setTruncated(Boolean(data.truncated));

      // Save to Firestore
      const stored: Omit<StoredAnalysis, 'id'> = {
        title: aiResult.title || opts.fileName || `${opts.contractType} Analysis`,
        contractType: aiResult.contractType,
        perspective: aiResult.perspective,
        overallRiskScore: aiResult.overallRiskScore,
        riskLevel: aiResult.riskLevel,
        summary: aiResult.executiveSummary,
        plainEnglishSummary: aiResult.plainEnglishSummary,
        simpleSummary: aiResult.simpleSummary,
        keyFindings: aiResult.redFlags,
        clauseAnalyses: aiResult.clauseAnalyses,
        negotiationPlan: aiResult.negotiationPlan,
        redlineSuggestions: aiResult.clauseAnalyses.map((c) => c.betterClauseSuggestion).filter(Boolean),
        questionsToAsk: aiResult.questionsToAskBeforeSigning,
        scenarioSimulations: aiResult.scenarioSimulations,
        redFlags: aiResult.redFlags,
        greenFlags: aiResult.greenFlags,
        missingProtections: aiResult.missingProtections,
        obligationsAcceptedByUser: aiResult.obligationsAcceptedByUser,
        rightsGivenAway: aiResult.rightsGivenAway,
        topRisks: aiResult.topRisks,
        finalRecommendation: aiResult.finalRecommendation,
        disclaimer: aiResult.disclaimer,
        truncated: Boolean(data.truncated),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'Report Ready',
      };

      const id = await saveAnalysis(opts.uid, stored);
      setSavedId(id);

      // Logging is best-effort: the report is already saved, so a failure here mustn't hide it
      await Promise.allSettled([
        logActivity(opts.uid, {
          type: 'analysis',
          title: stored.title,
          description: `${opts.contractType} — Risk Score: ${aiResult.overallRiskScore}/100 (${aiResult.riskLevel})`,
          analysisId: id,
        }),
        saveAILog(opts.uid, {
          analysisId: id,
          model: data.model || 'gemini',
          promptType: 'full_contract_analysis',
          success: true,
        }),
      ]);

      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      return null;
    } finally {
      clearInterval(progressInterval);
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setSavedId(null);
    setError(null);
    setCurrentStep('');
    setCurrentMessage('');
    setTruncated(false);
  };

  return { analyzing, currentStep, currentMessage, result, savedId, truncated, error, run, reset };
}
