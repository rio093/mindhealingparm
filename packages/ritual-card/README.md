# @maum/ritual-card

**KO** 3문항 향 진단 답변을 받아 "1분 준비 루틴 카드"를 생성하는 모듈입니다. OpenAI Responses API를 strict JSON schema로 호출하고, 생성된 모든 문장을 클레임 가드(의학·신체지표 표현 차단)에 통과시킵니다. API 키가 없거나 호출이 실패하면 규칙 기반 카드로 대체하므로, 이 모듈을 쓰는 페이지는 어떤 경우에도 깨지지 않습니다.

**EN** Generates a personalised "one-minute ritual card" from a three-question scent quiz. It calls the OpenAI Responses API with a strict JSON schema, runs every generated sentence through a claim guard (blocks medical and body-metric language), and falls back to rule-based copy when there is no key or the call fails, so a page that uses it never breaks.

Zero runtime dependencies. Node 18+.

## Install / 설치

Inside this repository the package is a workspace. To use it elsewhere, copy the `packages/ritual-card` folder or install from git:

```bash
npm install github:rio093/mindhealingparm#main --workspace packages/ritual-card
```

## Usage / 사용법

```js
import { generateRitualCard } from '@maum/ritual-card';

const card = await generateRitualCard(
  { q1: 'presentation', q2: 'b', q3: 'a' },   // quiz answer codes
  { locale: 'ko' }                            // apiKey defaults to process.env.OPENAI_API_KEY
);

console.log(card.source);   // 'openai' | 'fallback'
console.log(card.title, card.steps);
```

Answer codes match the landing page quiz:

| Field | Values | Meaning |
|---|---|---|
| `q1` | `presentation` `meeting` `call` | when the user wants to use it (context only) |
| `q2` | `a` `b` `c` | desired state — **decides the blend** |
| `q3` | `a` `b` `c` `?` | preferred scent character — recorded as a preference signal only |

Returned card:

```json
{
  "blend": "b",
  "blendName": "CLEAR MINT",
  "locale": "ko",
  "title": "또렷함의 1분",
  "opening": "…",
  "steps": ["…", "…", "…"],
  "closing": "…",
  "why": "…",
  "mismatchNote": "",
  "moment": "발표·피칭 직전",
  "source": "openai",
  "model": "gpt-5-mini"
}
```

When `source` is `fallback`, `fallbackReason` explains why: `no_api_key`, `http_429`, `timeout`, `claim_guard: why contains "스트레스 해소"`, and so on. Log it — it is the fastest way to see how often the model drifts into forbidden claims.

### Options

| Option | Default | Notes |
|---|---|---|
| `apiKey` | `process.env.OPENAI_API_KEY` | empty → fallback |
| `model` | `process.env.OPENAI_MODEL` or `gpt-5-mini` | any Responses-API model that supports `json_schema` output |
| `locale` | `ko` | `ko` or `en` |
| `endpoint` | `https://api.openai.com/v1/responses` | point at a proxy or a mock in tests |
| `fetch` | `globalThis.fetch` | inject for tests |
| `timeoutMs` | `12000` | aborts and falls back |

### CLI

```bash
npm run card -- --q1 meeting --q2 a --q3 '?' --locale en
OPENAI_API_KEY=sk-... npm run card -- --q2 c --json
```

### Claim guard only / 클레임 가드만 쓰기

```js
import { findClaimViolation, checkCard } from '@maum/ritual-card/guard';

findClaimViolation('스트레스 해소에 좋은 향');   // { match: '스트레스 해소' }
checkCard({ title: 'A one-beat switch' });     // { ok: true }
```

Useful as a pre-publish check for any wellness copy, not just this product.

## Adapting to your product / 다른 제품에 맞추기

1. Edit `src/blends.js` — blend ids, names, notes, and quiz option text.
2. Edit `src/fallback.js` — the safe copy shown without AI.
3. Adjust `FORBIDDEN_PATTERNS` in `src/guard.js` only after a compliance review; the defaults are deliberately broad.
4. Run `npm test`.

## Design notes / 설계 메모

- **Why structured output?** A strict schema means the page never has to parse free text and the model cannot invent extra fields.
- **Why a guard after the prompt?** The prompt already forbids medical claims, but prompts are not guarantees. The guard makes the safe behaviour deterministic.
- **Why fallback instead of throwing?** The landing page must work for every visitor. AI is an enhancement layer, not a dependency.
