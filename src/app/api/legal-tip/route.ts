import { generateLegalTip } from '@/lib/ai/aiService';
import { randomFallbackTip } from '@/lib/ai/tips';

export async function GET() {
  const tip = await generateLegalTip();
  return Response.json(tip ? { tip, source: 'ai' } : { tip: randomFallbackTip(), source: 'fallback' });
}
