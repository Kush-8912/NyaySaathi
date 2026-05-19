'use client';
import { useState } from 'react';
import { analyzeContract, type AnalysisProgressCallback } from '@/lib/ai/aiService';
import { saveAnalysis, logActivity, saveAILog } from '@/lib/firebase/firestore';
import type { AIAnalysisResult, StoredAnalysis } from '@/types/analysis';

interface UseAIAnalysisResult {
  analyzing: boolean;
  currentStep: string;
  currentMessage: string;
  result: AIAnalysisResult | null;
  savedId: string | null;
  usedMock: boolean;
  error: string | null;
  run: (opts: {
    uid: string;
    contractText: string;
    contractType: string;
    perspective: string;
    preferredLanguage: string;
    fileName?: string;
  }) => Promise<string | null>;
  reset: () => void;
}

export function useAIAnalysis(): UseAIAnalysisResult {
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [usedMock, setUsedMock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (opts: {
    uid: string;
    contractText: string;
    contractType: string;
    perspective: string;
    preferredLanguage: string;
    fileName?: string;
  }) => {
    setAnalyzing(true);
    setError(null);
    setResult(null);
    setSavedId(null);

    const onProgress: AnalysisProgressCallback = (step, message) => {
      setCurrentStep(step);
      setCurrentMessage(message);
    };

    try {
      const { result: aiResult, usedMock: mock } = await analyzeContract(
        {
          contractText: opts.contractText,
          contractType: opts.contractType,
          perspective: opts.perspective,
          preferredLanguage: opts.preferredLanguage,
        },
        onProgress,
      );

      setResult(aiResult);
      setUsedMock(mock);

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
        keyFindings: aiResult.redFlags || [],
        clauseAnalyses: aiResult.clauseAnalyses || [],
        negotiationPlan: aiResult.negotiationPlan || [],
        redlineSuggestions: aiResult.clauseAnalyses?.map((c) => c.betterClauseSuggestion).filter(Boolean) || [],
        questionsToAsk: aiResult.questionsToAskBeforeSigning || [],
        scenarioSimulations: aiResult.scenarioSimulations || [],
        redFlags: aiResult.redFlags || [],
        greenFlags: aiResult.greenFlags || [],
        missingProtections: aiResult.missingProtections || [],
        obligationsAcceptedByUser: aiResult.obligationsAcceptedByUser || [],
        rightsGivenAway: aiResult.rightsGivenAway || [],
        topRisks: aiResult.topRisks || [],
        finalRecommendation: aiResult.finalRecommendation || '',
        disclaimer: aiResult.disclaimer || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'Report Ready',
      };

      const id = await saveAnalysis(opts.uid, stored);
      setSavedId(id);

      await logActivity(opts.uid, {
        type: 'analysis',
        title: stored.title,
        description: `${opts.contractType} — Risk Score: ${aiResult.overallRiskScore}/100 (${aiResult.riskLevel})`,
        analysisId: id,
      });

      await saveAILog(opts.uid, {
        analysisId: id,
        model: mock ? 'mock' : 'gemini-1.5-flash',
        promptType: 'full_contract_analysis',
        success: true,
      });

      return id;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      setError(msg);
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setSavedId(null);
    setError(null);
    setCurrentStep('');
    setCurrentMessage('');
    setUsedMock(false);
  };

  return { analyzing, currentStep, currentMessage, result, savedId, usedMock, error, run, reset };
}
