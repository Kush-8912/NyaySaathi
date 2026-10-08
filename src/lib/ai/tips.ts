// Shown when the AI tip can't be generated (no API key, network error, bad response)
export const FALLBACK_TIPS = [
  '🔍 Non-compete clauses over 12 months are often unenforceable in India — always check the duration.',
  '⚖️ One-sided arbitration clauses — where one party picks the arbitrator — are a major red flag. Negotiate.',
  '💡 IP clauses covering "ideas conceived outside work hours" are increasingly challenged in Indian courts.',
  '🔐 Auto-renewal clauses with 30+ day notice windows are a common trap. Flag them before signing.',
  '📝 Missing termination-for-cause definitions? That leaves you exposed to arbitrary firing.',
];

export function randomFallbackTip(): string {
  return FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
}
