# Next.js App Router example

1. `npm install @maum/ritual-card`
2. Copy `route.ts` to `app/api/ritual-card/route.ts`
3. Add `OPENAI_API_KEY` to `.env.local` (optional)
4. `curl -X POST localhost:3000/api/ritual-card -H 'content-type: application/json' -d '{"q1":"meeting","q2":"b","q3":"a"}'`

The key never reaches the browser; the client calls your route, the route calls OpenAI.
