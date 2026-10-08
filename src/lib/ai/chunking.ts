/**
 * Returns the part of the contract that is sent to the AI, and whether it had to be cut.
 * Cuts at the last paragraph or sentence break before the limit so no clause is split mid-sentence.
 */
export function getAnalysisText(text: string, maxChars: number): { text: string; truncated: boolean } {
  if (text.length <= maxChars) return { text, truncated: false };

  const slice = text.slice(0, maxChars);
  const breakAt = Math.max(slice.lastIndexOf('\n\n'), slice.lastIndexOf('. '));
  // Only use the break if it doesn't throw away more than ~10% of the allowed text
  const end = breakAt > maxChars * 0.9 ? breakAt + 1 : maxChars;
  return { text: slice.slice(0, end).trim(), truncated: true };
}
