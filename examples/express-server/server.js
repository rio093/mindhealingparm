// examples/express-server/server.js
//   npm install express @maum/ritual-card
//   OPENAI_API_KEY=sk-... node server.js
// Express 서버 예제. 키가 없으면 폴백 카드를 돌려줍니다.

import express from 'express';
import { generateRitualCard, findClaimViolation } from '@maum/ritual-card';

const app = express();
app.use(express.json());

// 1) Personalised ritual card
app.post('/ritual-card', async (req, res) => {
  const { q1 = '', q2, q3 = '?', locale = 'ko' } = req.body ?? {};
  if (!['a', 'b', 'c'].includes(q2)) return res.status(400).json({ error: 'q2 must be one of a, b, c' });
  const card = await generateRitualCard({ q1, q2, q3 }, { locale });
  res.set('Cache-Control', 'no-store').json(card);
});

// 2) Claim guard as a standalone endpoint — check any wellness copy before it ships
app.post('/check-copy', (req, res) => {
  const text = String(req.body?.text ?? '');
  const violation = findClaimViolation(text);
  res.json({ ok: !violation, violation });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`ritual-card example on http://localhost:${port}`));
