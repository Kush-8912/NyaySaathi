import { GoogleGenerativeAI } from '@google/generative-ai';

const FALLBACK_TIPS = [
  '🔍 Non-compete clauses over 12 months are often unenforceable in India — always check the duration.',
  '⚖️ One-sided arbitration clauses — where one party picks the arbitrator — are a major red flag. Negotiate.',
  '💡 IP clauses covering "ideas conceived outside work hours" are increasingly challenged in Indian courts.',
  '🔐 Auto-renewal clauses with 30+ day notice windows are a common trap. Flag them before signing.',
  '📝 Missing termination-for-cause definitions? That leaves you exposed to arbitrary firing.',
];

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    const tip = FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
    return Response.json({ tip, source: 'fallback' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are NyaySaathi, an AI legal assistant specialised in Indian contract law.

Generate exactly ONE practical legal tip for someone reviewing or signing contracts in India today.
The tip should be:
- Specific to Indian law (mention relevant acts, sections, or Indian court trends where helpful)
- Actionable and immediately useful
- 1–2 sentences max (under 60 words)
- Written in plain English (no legalese)
- Start with a relevant emoji

Respond with ONLY the tip text — no title, no label, no extra text.`;

    const response = await model.generateContent(prompt);
    const tip = response.response.text().trim();

    if (!tip || tip.length < 20 || tip.length > 400) {
      throw new Error('Malformed tip response');
    }

    return Response.json({ tip, source: 'ai' });
  } catch (err) {
    console.error('[/api/legal-tip] Gemini call failed:', err);
    const tip = FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
    return Response.json({ tip, source: 'fallback' });
  }
}
