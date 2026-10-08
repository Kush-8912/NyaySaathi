/**
 * Extract text from a DOCX file using mammoth (browser-safe).
 */
export async function extractDOCXText(file: File): Promise<string> {
  let text: string;
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    text = result.value.trim();
  } catch (err) {
    console.error('DOCX extraction failed:', err);
    throw new Error('Failed to extract text from DOCX. Please paste the text manually.');
  }

  if (!text) throw new Error('This document has no text in it. Please paste the text manually.');
  return text;
}
