/**
 * Vercel serverless function: POST /api/ritual-card
 *
 * Body: { q1: "presentation|meeting|call", q2: "a|b|c", q3: "a|b|c|?", locale: "ko|en", ai?: boolean }
 *
 * Two modes, by design:
 *   ai: false (default)  → rule-based fallback card. No OpenAI call, no key needed, no rate limit.
 *   ai: true             → calls OpenAI through @maum/ritual-card. Requires OPENAI_API_KEY on the
 *                          server, is rate-limited per client, and is restricted to allowed origins.
 *
 * Security boundary (see SECURITY.md):
 *   - The OpenAI key never leaves the server. The browser only ever sees card JSON.
 *   - Input is validated to an enum before it reaches the prompt; free text is never forwarded.
 *   - Generated text passes the claim guard before it is returned.
 *   - Abuse controls: per-IP token bucket (in-memory, best-effort on serverless), origin allowlist,
 *     small max body, no-store caching.
 *
 * 기본은 폴백 카드(OpenAI 호출 없음). "Generate with OpenAI" 버튼처럼 ai:true로 요청할 때만
 * 실제 API를 호출하며, 그 경로에만 rate limit과 origin 제한이 걸립니다.
 */
import { generateRitualCard, fallbackCard, resolveBlend } from '../packages/ritual-card/src/index.js';

const ALLOWED_Q1 = new Set(['presentation', 'meeting', 'call', '']);
const ALLOWED_Q2 = new Set(['a', 'b', 'c']);
const ALLOWED_Q3 = new Set(['a', 'b', 'c', '?', '']);

// Rate limit for the AI path only. Best-effort: each serverless instance keeps its own bucket.
const AI_LIMIT = Number(process.env.RITUAL_AI_LIMIT || 5);          // requests
const AI_WINDOW_MS = Number(process.env.RITUAL_AI_WINDOW_MS || 60_000); // per window
const buckets = new Map(); // ip -> number[] (timestamps)

function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  return (Array.isArray(xf) ? xf[0] : (xf || '')).split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

function rateLimited(ip) {
  const now = Date.now();
  const hits = (buckets.get(ip) || []).filter((t) => now - t < AI_WINDOW_MS);
  if (hits.length >= AI_LIMIT) {
    buckets.set(ip, hits);
    return Math.ceil((AI_WINDOW_MS - (now - hits[0])) / 1000);
  }
  hits.push(now);
  buckets.set(ip, hits);
  if (buckets.size > 5000) buckets.clear(); // crude memory cap
  return 0;
}

function originAllowed(req) {
  const allow = (process.env.RITUAL_ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!allow.length) return true; // not configured → allow (fallback path is harmless anyway)
  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';
  return allow.some((a) => origin === a || referer.startsWith(a));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    if (body.length > 2048) return res.status(413).json({ error: 'body_too_large' });
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'invalid_json' });

  const q1 = String(body.q1 ?? '');
  const q2 = String(body.q2 ?? '');
  const q3 = String(body.q3 ?? '?');
  if (!ALLOWED_Q2.has(q2)) return res.status(400).json({ error: 'q2 must be one of a, b, c' });
  if (!ALLOWED_Q1.has(q1) || !ALLOWED_Q3.has(q3)) return res.status(400).json({ error: 'invalid answer code' });

  const locale = body.locale === 'en' ? 'en' : 'ko';
  const answers = { q1, q2, q3 };

  // Default path: deterministic fallback, no external call.
  if (body.ai !== true) {
    const { mismatch } = resolveBlend(answers);
    return res.status(200).json({ ...fallbackCard(answers, locale, mismatch), fallbackReason: 'ai_not_requested' });
  }

  // AI path: guarded.
  if (!originAllowed(req)) return res.status(403).json({ error: 'origin_not_allowed' });
  const retry = rateLimited(clientIp(req));
  if (retry) {
    res.setHeader('Retry-After', String(retry));
    return res.status(429).json({ error: 'rate_limited', retryAfter: retry });
  }
  if (!process.env.OPENAI_API_KEY) {
    const { mismatch } = resolveBlend(answers);
    return res.status(200).json({ ...fallbackCard(answers, locale, mismatch), fallbackReason: 'no_api_key' });
  }

  const card = await generateRitualCard(answers, { locale });
  return res.status(200).json(card);
}
