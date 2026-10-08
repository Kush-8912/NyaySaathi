import { analyzeContract, AnalysisError } from '@/lib/ai/aiService';
import { verifyFirebaseIdToken } from '@/lib/firebase/verifyIdToken';
import { CONTRACT_TYPES, USER_PERSPECTIVES, PREFERRED_LANGUAGES } from '@/lib/constants';

// A full contract analysis can take 20-40 seconds
export const maxDuration = 60;

// Hard cap on what a client may send; the analysis itself uses at most MAX_TEXT_CHARS
const MAX_REQUEST_CHARS = 200_000;

const fail = (status: number, error: string) => Response.json({ error }, { status });

// POST /api/analyze   Authorization: Bearer <Firebase ID token>
// body: { contractText, contractType, perspective, preferredLanguage }
export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  const uid = token ? await verifyFirebaseIdToken(token) : null;
  if (!uid) return fail(401, 'Please sign in again to analyze contracts.');

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail(400, 'Invalid request.');
  }

  const contractText = typeof body.contractText === 'string' ? body.contractText.trim() : '';
  if (contractText.length < 50) return fail(400, 'Please provide at least 50 characters of contract text.');
  if (contractText.length > MAX_REQUEST_CHARS) return fail(413, 'This document is too large to analyze.');

  // Only known options reach the prompt
  const pick = (value: unknown, allowed: readonly string[], fallback: string) =>
    typeof value === 'string' && allowed.includes(value) ? value : fallback;

  try {
    const analysis = await analyzeContract({
      contractText,
      contractType: pick(body.contractType, CONTRACT_TYPES, 'Other'),
      perspective: pick(body.perspective, USER_PERSPECTIVES, 'Individual User'),
      preferredLanguage: pick(body.preferredLanguage, PREFERRED_LANGUAGES, 'English'),
    });
    return Response.json(analysis);
  } catch (err) {
    if (err instanceof AnalysisError) return fail(err.status, err.message);
    console.error('[/api/analyze] Unexpected error:', err);
    return fail(500, 'Something went wrong while analyzing. Please try again.');
  }
}
