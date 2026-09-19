# Security Policy · 보안 정책

## Reporting a vulnerability / 취약점 신고

Email **korrio093@gmail.com** with the subject `[mindhealingparm security]`. Please do not open a public issue for security problems. You will get an acknowledgement within 72 hours. 공개 이슈 대신 이메일로 알려 주세요.

## Threat model (what this project actually exposes)

This repository is a static landing page plus one serverless endpoint. The only trust boundary is `api/ritual-card.js`.

| Asset | Where it lives | Control |
|---|---|---|
| `OPENAI_API_KEY` | Vercel environment variable, server only | Never sent to the browser; never logged; `.env` is git-ignored and `.env.example` is empty |
| OpenAI spend | `POST /api/ritual-card` with `ai: true` | Off by default (`ai` must be explicitly `true`); per-IP token bucket (`RITUAL_AI_LIMIT` / `RITUAL_AI_WINDOW_MS`); optional origin allowlist (`RITUAL_ALLOWED_ORIGINS`); 12 s timeout |
| Prompt injection | Quiz answers | Inputs are validated against fixed enums (`a/b/c`, `presentation/meeting/call`, `?`) before prompt construction; no free text reaches the model |
| Harmful / non-compliant output | Generated card | Strict JSON schema, then the claim guard (`packages/ritual-card/src/guard.js`) rejects medical and body-metric language; on any failure the deterministic fallback card is returned |
| Visitor emails | Pre-order form → Formspree | Not stored by this codebase; the form `action` is the only place to change the processor |
| Client analytics | Plausible | Cookieless; event props contain answer codes only, never PII |

Out of scope: the `web-next/` app (no server code), GitHub Actions (read-only permissions except the publish workflow, which uses npm trusted publishing with OIDC instead of a stored token).

## Known limitations

- The rate limiter is in-memory per serverless instance; a determined actor across many instances can exceed it. Set `RITUAL_ALLOWED_ORIGINS` and a low `RITUAL_AI_LIMIT` in production, and put a monthly spend cap on the OpenAI key.
- `RITUAL_ALLOWED_ORIGINS` relies on `Origin`/`Referer`, which are advisory for non-browser clients. It stops casual hot-linking, not a scripted attacker.

## Supported versions

Only `main` receives fixes.
