/**
 * Attempts to extract and parse valid JSON from an AI response string.
 * Handles markdown code fences, text around the JSON object and trailing commas.
 */
export function repairJSON(raw: string): unknown {
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

  // 3. Extract the outermost {...} block
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    // continue
  }

  // 4. Remove trailing commas. (Quotes are deliberately left alone: replacing ' with "
  //    would corrupt apostrophes in the text, e.g. "employee's".)
  try {
    return JSON.parse(cleaned.replace(/,\s*([}\]])/g, '$1'));
  } catch {
    return null;
  }
}
