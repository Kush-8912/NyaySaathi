'use client';
import { useState, useEffect, useCallback } from 'react';
import { getUserAnalyses, deleteAnalysis } from '@/lib/firebase/firestore';
import type { StoredAnalysis } from '@/types/analysis';

export function useAnalyses(uid: string | null) {
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = useCallback(async () => {
    if (!uid) { setAnalyses([]); return; }
    setLoading(true);
    try {
      const data = await getUserAnalyses(uid);
      setAnalyses(data);
    } catch {
      setError('Failed to load analyses');
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => { fetchAnalyses(); }, [fetchAnalyses]);

  const remove = async (analysisId: string) => {
    if (!uid) return;
    await deleteAnalysis(uid, analysisId);
    setAnalyses((prev) => prev.filter((a) => a.id !== analysisId));
  };

  return { analyses, loading, error, refetch: fetchAnalyses, remove };
}
