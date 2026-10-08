// SERVER ONLY. Checks a Firebase ID token with Google's Identity Toolkit API and returns
// the user's uid, or null if the token is missing, expired or forged.
// Uses the public Firebase web API key, so no service-account credentials are needed.
export async function verifyFirebaseIdToken(idToken: string): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey || !idToken) return null;

  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      cache: 'no-store',
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { users?: { localId?: string }[] };
    return data.users?.[0]?.localId ?? null;
  } catch (err) {
    console.error('[verifyFirebaseIdToken] lookup failed:', err);
    return null;
  }
}
