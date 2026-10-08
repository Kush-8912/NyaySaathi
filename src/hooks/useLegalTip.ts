import { useState, useEffect } from 'react';
import { randomFallbackTip } from '@/lib/ai/tips';

interface UseLegalTipResult {
  tip: string | null;
  loading: boolean;
}

export async function fetchLegalTipFromAPI(): Promise<string> {
  try {
    const res = await fetch('/api/legal-tip');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as { tip: string; source: string };
    return data.tip;
  } catch (err) {
    console.warn('fetchLegalTipFromAPI failed:', err);
    return randomFallbackTip();
  }
}

export function useLegalTip(): UseLegalTipResult {
  // Starts as loading; the effect below only sets state from the async callback
  const [tip, setTip] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchLegalTipFromAPI().then((t) => {
      if (!cancelled) setTip(t);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { tip, loading: tip === null };
}
