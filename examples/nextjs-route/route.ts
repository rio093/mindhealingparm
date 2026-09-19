// examples/nextjs-route/route.ts
// Drop into a Next.js App Router project as `app/api/ritual-card/route.ts`.
//   npm install @maum/ritual-card
//   OPENAI_API_KEY=sk-... in .env.local (optional — without it you get the fallback card)
//
// Next.js App Router용 예제. 파일을 app/api/ritual-card/route.ts 로 복사하면 됩니다.

import { NextResponse } from 'next/server';
import { generateRitualCard, type QuizAnswers } from '@maum/ritual-card';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<QuizAnswers> & { locale?: 'ko' | 'en' } | null;
  if (!body || !['a', 'b', 'c'].includes(body.q2 ?? '')) {
    return NextResponse.json({ error: 'q2 must be one of a, b, c' }, { status: 400 });
  }
  const card = await generateRitualCard(
    { q1: body.q1 ?? '', q2: body.q2 as QuizAnswers['q2'], q3: body.q3 ?? '?' },
    { locale: body.locale === 'en' ? 'en' : 'ko' },
  );
  return NextResponse.json(card, { headers: { 'Cache-Control': 'no-store' } });
}
