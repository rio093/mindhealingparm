/**
 * Vercel serverless function: POST /api/ritual-card
 * Body: { "q1": "presentation|meeting|call", "q2": "a|b|c", "q3": "a|b|c|?", "locale": "ko|en" }
 * Returns the ritual card JSON from packages/ritual-card.
 *
 * The OpenAI key stays on the server (OPENAI_API_KEY env var in Vercel).
 * Without the key the endpoint still answers with the rule-based fallback card,
 * so the landing page never breaks.
 *
 * Vercel 서버리스 함수. OPENAI_API_KEY가 없어도 폴백 카드를 돌려주므로
 * 랜딩 페이지 동작에는 영향이 없습니다.
 */
import { generateRitualCard } from '../packages/ritual-card/src/index.js';

const ALLOWED_Q2 = new Set(['a', 'b', 'c']);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || !ALLOWED_Q2.has(body.q2)) {
    return res.status(400).json({ error: 'q2 must be one of a, b, c' });
  }

  const answers = { q1: String(body.q1 ?? ''), q2: body.q2, q3: String(body.q3 ?? '?') };
  const card = await generateRitualCard(answers, { locale: body.locale === 'en' ? 'en' : 'ko' });
  return res.status(200).json(card);
}
