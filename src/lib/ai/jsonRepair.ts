/**
 * Attempts to extract and parse valid JSON from an AI response string.
 * Handles markdown code fences, partial JSON, and common AI formatting artifacts.
 */
export function repairJSON(raw: string): object | null {
  if (!raw) return null;

  // 1. Strip markdown code fences
  let cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // 2. Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch {
    // continue to repair
  }

  // 3. Extract first {...} block
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  // 4. Try again after extraction
  try {
    return JSON.parse(cleaned);
  } catch {
    // continue
  }

  // 5. Fix common issues: trailing commas, single quotes
  cleaned = cleaned
    .replace(/,\s*([}\]])/g, '$1') // trailing commas
    .replace(/'/g, '"') // single to double quotes
    .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3'); // unquoted keys

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
