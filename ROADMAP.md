# Roadmap · 로드맵

The roadmap is tracked as GitHub Issues with the `roadmap` label; this file is the readable summary. Items move between columns as issues close. Dates are intentions, not promises.

로드맵은 `roadmap` 라벨이 붙은 GitHub Issues로 관리하고, 이 파일은 읽기 쉬운 요약입니다. 이슈가 닫히면 항목이 이동합니다. 일정은 약속이 아니라 의도입니다.

## Now — v0.1 (released)

- [x] Static landing page: hero, empathy, product, 3-question quiz, trust, pre-order form, FAQ
- [x] Plausible event tracking for CTA, quiz completion, pre-order
- [x] Next.js renewal in `web-next/` with the same design system
- [x] `@maum/ritual-card`: OpenAI Responses API + strict JSON schema + claim guard + fallback
- [x] Vercel function `api/ritual-card.js` and opt-in hook in the landing quiz
- [x] Open-source scaffolding: bilingual README, CONTRIBUTING, templates, CI

## Next — v0.2

- [ ] **Configurable copy**: move brand text and blends into a single `site.config.js` so a fork only edits one file
- [ ] **Quiz analytics events for each step** (Q1/Q2/Q3 answered), not only completion, so funnel drop-off is visible
- [ ] **UTM capture** into the pre-order form hidden fields
- [ ] **English landing variant** (`index.en.html`) using the same CSS and JS
- [ ] **ritual-card: streaming** for perceived speed on slow connections
- [ ] **ritual-card: guard test corpus** — a shared list of allowed/forbidden phrases contributors can extend

## Later — v0.3+

- [ ] Paid pre-order flow (Stripe payment link or equivalent) behind a feature flag, with the legal checklist for online sales documented
- [ ] Consent notice, purpose, and retention statement for the email form as a reusable snippet
- [ ] Scent safety cautions block (pregnancy, children, asthma, sensitivities) as a standard FAQ component
- [ ] `web-next` becomes the primary deploy target; static version kept as the zero-build option
- [ ] Optional adapters for other LLM providers behind the same `generateRitualCard` interface

## Out of scope

- Medical, therapeutic, or performance claims of any kind
- Storing quiz answers server-side without explicit consent
- A native mobile app (validate demand with the web page first)

## How to propose something

Open an issue with the `roadmap` label and describe the user problem before the solution. See [CONTRIBUTING.md](CONTRIBUTING.md).
