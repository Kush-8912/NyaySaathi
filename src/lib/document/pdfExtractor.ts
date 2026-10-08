// Very long PDFs are capped to keep extraction fast; the AI only reads MAX_TEXT_CHARS anyway
const MAX_PAGES = 100;

/**
 * Extract text from a PDF file using pdfjs-dist (browser-safe).
 */
export async function extractPDFText(file: File): Promise<string> {
  let pdfjsLib: typeof import('pdfjs-dist');
  try {
    // Dynamic import to avoid SSR issues
    pdfjsLib = await import('pdfjs-dist');
    // pdf.js v4+ only ships an ES-module worker (.mjs). The version is taken from the
    // installed package so the worker always matches the library.
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  } catch (err) {
    console.error('PDF library failed to load:', err);
    throw new Error('Could not load the PDF reader. Check your connection, or paste the text manually.');
  }

  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  } catch (err) {
    console.error('PDF extraction failed:', err);
    const message = err instanceof Error && err.name === 'PasswordException'
      ? 'This PDF is password-protected. Remove the password or paste the text manually.'
      : 'Could not read this PDF. Please paste the text manually.';
    throw new Error(message);
  }

  let fullText = '';
  for (let i = 1; i <= Math.min(pdf.numPages, MAX_PAGES); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += pageText + '\n\n';
  }

  const text = fullText.trim();
  if (!text) {
    throw new Error('No selectable text found — this looks like a scanned PDF. Please paste the text manually.');
  }
  return text;
}
