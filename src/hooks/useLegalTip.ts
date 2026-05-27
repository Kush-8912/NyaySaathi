import { useState, useEffect } from 'react';

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
    const fallbacks = [
      '🔍 Non-compete clauses over 12 months are often unenforceable in India — always check the duration.',
      '⚖️ One-sided arbitration clauses — where one party picks the arbitrator — are a major red flag. Negotiate.',
      '💡 IP clauses covering "ideas conceived outside work hours" are increasingly challenged in Indian courts.',
      '🔐 Auto-renewal clauses with 30+ day notice windows are a common trap. Flag them before signing.',
      '📝 Missing termination-for-cause definitions? That leaves you exposed to arbitrary firing.',
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

export function useLegalTip(): UseLegalTipResult {
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    fetchLegalTipFromAPI().then((t) => {
      if (!cancelled) {
        setTip(t);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { tip, loading };
}
