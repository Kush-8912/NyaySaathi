/**
 * Normalize and clean extracted contract text.
 */
export function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function getTextPreview(text: string, maxChars = 500): string {
  const cleaned = cleanText(text);
  return cleaned.length <= maxChars ? cleaned : cleaned.slice(0, maxChars) + '...';
}
