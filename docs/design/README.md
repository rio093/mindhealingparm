# Design notes · 디자인 노트

How the v2 landing (`index.html`) was designed, and from what. Two reference studies, each done in a real browser on 2026-09-19, with a strict split of roles:

| Study | Role in v2 | File |
|---|---|---|
| faithibiza.com (UK, luxury concierge) | **Visual grammar only** — two-voice typography, ink arch hero, tile grid, sticky stack, motion budget | [faithibiza-study.md](faithibiza-study.md) |
| skin1004korea.com (KR, Cafe24 brand mall) | **Content order, menu, CTA and footer conventions** for Korean users | [skin1004-study.md](skin1004-study.md) |

Rule of thumb that produced the split: a foreign layout applied as-is feels off to Korean users, so the Korean site decides *what goes where*, and the foreign site decides *how it looks*.

## What shipped in v2 (traceable to the studies)

- OSS bar above the nav stating the site is an open-source reference implementation, with GitHub / Documentation / Try AI module (reviewer request).
- Ink arch hero that expands to full-bleed on scroll (faith §2-1), no floating decorations, one scroll cue (reviewer request: cut decoration 30–50%).
- Product lineup as photo cards in the *second* screen with "사전 관심 등록" where a Korean mall shows price + SHOP NOW (skin1004 §3-1).
- Two-voice headings: English caps line + one Korean line; the Korean line replaces faith's script font (skin1004 §3, faith §2 rules).
- One dark band only (ritual sticky stack), everything else on sand (skin1004 §3-8).
- Live `@maum/ritual-card` demo: rule-based card by default, "Generate with OpenAI" as a separate, rate-limited call (reviewer request; see `SECURITY.md`).
- Korean-standard 3-column footer with the same field names as a real mall (values "준비 중" until the entity exists) (skin1004 §2-7).

## Not taken

Commercial fonts (Dream Orphans, Eastern Harrogate, Montserrat wordmark), any photo or video, copy, logos, the notice popup and scroll-to-top button, 20,000px page lengths, scroll-jacking that hides the CTA.

## Measuring "better"

Not taste. Quiz-start rate and pre-order-interest rate versus v1 (`index.v1.html`) on the same traffic, split by UTM.
