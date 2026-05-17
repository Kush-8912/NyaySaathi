/**
 * Splits long contract text into manageable chunks for AI processing.
 * Preserves paragraph integrity where possible.
 */
export function chunkText(text: string, maxChars = 12000): string[] {
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let current = '';

  for (const para of paragraphs) {
    if ((current + para).length > maxChars) {
      if (current.trim()) chunks.push(current.trim());
      // If a single paragraph exceeds limit, split by sentences
      if (para.length > maxChars) {
        const sentences = para.split(/(?<=[.!?])\s+/);
        let sentChunk = '';
        for (const s of sentences) {
          if ((sentChunk + s).length > maxChars) {
            if (sentChunk.trim()) chunks.push(sentChunk.trim());
            sentChunk = s + ' ';
          } else {
            sentChunk += s + ' ';
          }
        }
        if (sentChunk.trim()) current = sentChunk;
        else current = '';
      } else {
        current = para + '\n\n';
      }
    } else {
      current += para + '\n\n';
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/**
 * Returns the most important chunk(s) for AI analysis.
 * For demo we take the first 12000 chars to stay within limits.
 */
export function getAnalysisText(text: string, maxChars = 12000): string {
  return text.slice(0, maxChars);
}
