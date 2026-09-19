# 마음약방 · Maum Yakbang

**미팅 전 1분 준비 루틴 브랜드를 위한 오픈소스 랜딩 페이지 템플릿과 AI 루틴 카드 모듈**
**An open-source landing page template for a pre-meeting scent ritual, plus an OpenAI-powered ritual-card module**

[![CI](https://github.com/rio093/mindhealingparm/actions/workflows/ci.yml/badge.svg)](https://github.com/rio093/mindhealingparm/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live demo](https://img.shields.io/badge/demo-mindhealingparm.vercel.app-111)](https://mindhealingparm.vercel.app)

🇰🇷 [한국어](#한국어) · 🇬🇧 [English](#english)

---

## 한국어

### 이 저장소는 무엇인가요

마음약방은 중요한 미팅, 발표, 클라이언트 피칭 직전에 쓰는 흡입 전용 향 스틱과 1분 호흡 카드 기반의 준비 루틴 브랜드입니다. 이 저장소는 그 브랜드의 v1 랜딩 페이지를 **누구나 가져다 쓸 수 있는 형태**로 정리한 것입니다.

- **랜딩 페이지 템플릿**: 빌드 도구 없이 동작하는 정적 HTML·CSS·JS. 3문항 진단 퀴즈, 사전 주문 관심 등록 폼, Plausible 이벤트 추적이 들어 있습니다. 문구와 블렌드만 바꾸면 향, 차, 캔들, 루틴 제품 등 "상황 전환" 컨셉의 제품에 그대로 쓸 수 있습니다.
- **`@maum/ritual-card` 모듈**: 진단 답변을 받아 OpenAI Responses API로 개인화된 1분 루틴 카드를 생성합니다. 의학·신체지표 표현을 차단하는 클레임 가드와 규칙 기반 폴백이 내장되어 있어, API 키가 없어도 페이지가 깨지지 않습니다. 웰니스 카피 검사기로 단독 사용도 가능합니다.
- **Next.js 리뉴얼(`web-next/`)**: 같은 디자인 시스템을 React 상태와 motion 애니메이션으로 다시 구현한 버전입니다. 정적 버전과 Next 버전 중 편한 쪽을 고르세요.

### 빠른 시작

```bash
git clone https://github.com/rio093/mindhealingparm.git
cd mindhealingparm
npm install          # 워크스페이스(packages/ritual-card) 설정
npm run dev          # http://localhost:8765 에서 정적 랜딩 확인
npm test             # 모듈 테스트
npm run card -- --q2 b --q3 a   # AI 카드 CLI (키 없으면 폴백 카드 출력)
```

Next.js 버전은 `cd web-next && npm install && npm run dev` 로 실행합니다.

### 저장소 구조

```
index.html / styles.css / script.js   정적 랜딩 페이지 (배포 대상)
api/ritual-card.js                    Vercel 서버리스 함수 — 모듈을 HTTP로 노출
packages/ritual-card/                 @maum/ritual-card 모듈 (테스트·CLI 포함)
web-next/                             Next.js 리뉴얼 (선택)
examples/                             모듈 사용 예시
.github/                              CI, 이슈·PR 템플릿
ROADMAP.md · CHANGELOG.md · CONTRIBUTING.md
```

### 내 제품에 맞게 바꾸기

| 바꿀 것 | 위치 |
|---|---|
| 브랜드명, 카피, FAQ | `index.html` |
| 색·타이포·간격 토큰 | `styles.css` 상단 `:root` |
| 블렌드(제품 종류)와 진단 문항 | `index.html`의 `.diag` 블록, `packages/ritual-card/src/blends.js` |
| 사전 주문 폼 엔드포인트 | `index.html`의 `<form action="https://formspree.io/f/YOUR_FORM_ID">` — 이 값 하나만 바꾸면 JS가 따라갑니다 |
| 분석 도구 | `index.html`의 Plausible `data-domain` (다른 도구를 쓰면 `script.js`의 `track()` 한 곳만 수정) |
| AI 카드 켜기 | `index.html`의 `.diag`에 `data-ai-endpoint="/api/ritual-card"`, Vercel 환경변수에 `OPENAI_API_KEY` |

### 진단 로직

세 문항 중 **2번(원하는 상태)이 블렌드를 결정**하고, 3번(끌리는 향의 결)은 선호 신호로만 기록합니다. 두 답이 다르면 "취향은 다르지만 지금 필요한 상태에는 이 쪽"이라는 안내가 붙습니다. 이 규칙은 `script.js`, `web-next/components/Diagnostic.tsx`, `packages/ritual-card/src/blends.js` 세 곳에서 동일하게 구현되어 있습니다.

현재 블렌드는 세 가지입니다: **Calm Basil**(정돈된 집중), **Clear Mint**(또렷한 모드), **Energy Citrus**(산뜻한 리프레시).

### 카피 가이드

이 템플릿은 제품을 "상황 전환 도구"와 "준비 루틴"으로만 설명합니다. 포크해서 쓰실 때도 아래 원칙을 지키시길 권합니다.

- 상황, 정체성, 무드 중심으로 표현합니다. 어휘: 정돈, 또렷, 전환, 준비, 루틴, 의식.
- 스트레스 해소, 불안 완화, 집중력 향상, 치료, 효능처럼 신체 지표·질환·의학적 효과로 읽힐 수 있는 표현은 쓰지 않습니다. `@maum/ritual-card`의 클레임 가드가 같은 기준으로 생성 문구를 검사합니다.
- 제품 분류(화장품·방향제 등)와 표시 기준은 판매 전 관할 기관이나 전문가에게 확인해야 합니다. 이 저장소는 그 판단을 대신하지 않습니다.

### 기여하기

이슈와 PR을 환영합니다. 방법은 [CONTRIBUTING.md](CONTRIBUTING.md), 방향은 [ROADMAP.md](ROADMAP.md)를 보세요. 기여자는 [행동 강령](CODE_OF_CONDUCT.md)을 따릅니다.

---

## English

### What this repository is

Maum Yakbang ("mind pharmacy") is a pre-meeting preparation ritual brand: an inhalation-only scent stick and a one-minute breathing card, used right before an important meeting, presentation, or client pitch. This repository turns the brand's v1 landing page into something **anyone can fork and reuse**.

- **Landing page template**: static HTML, CSS, and JavaScript with no build step. Includes a three-question matching quiz, a pre-order interest form, and Plausible event tracking. Swap the copy and the blends and it works for any "switch into a state" product — scent, tea, candles, routine kits.
- **`@maum/ritual-card` module**: takes quiz answers and generates a personalised one-minute ritual card through the OpenAI Responses API. A built-in claim guard blocks medical and body-metric language, and a rule-based fallback keeps the page working without an API key. The guard can be used on its own as a wellness-copy linter.
- **Next.js renewal (`web-next/`)**: the same design system rebuilt with React state and motion animations. Pick whichever version suits you.

### Quick start

```bash
git clone https://github.com/rio093/mindhealingparm.git
cd mindhealingparm
npm install          # sets up the workspace (packages/ritual-card)
npm run dev          # static landing at http://localhost:8765
npm test             # module tests
npm run card -- --q2 b --q3 a --locale en   # ritual-card CLI (prints the fallback card without a key)
```

For the Next.js version: `cd web-next && npm install && npm run dev`.

### Repository layout

```
index.html / styles.css / script.js   static landing page (what gets deployed)
api/ritual-card.js                    Vercel serverless function exposing the module over HTTP
packages/ritual-card/                 @maum/ritual-card module (tests and CLI included)
web-next/                             Next.js renewal (optional)
examples/                             module usage examples
.github/                              CI, issue and PR templates
ROADMAP.md · CHANGELOG.md · CONTRIBUTING.md
```

### Adapting it to your product

| What to change | Where |
|---|---|
| Brand name, copy, FAQ | `index.html` |
| Colour, type, and spacing tokens | `:root` at the top of `styles.css` |
| Blends (product variants) and quiz questions | the `.diag` block in `index.html`, `packages/ritual-card/src/blends.js` |
| Pre-order form endpoint | `<form action="https://formspree.io/f/YOUR_FORM_ID">` in `index.html` — the JS reads it from there, so this is the only place to edit |
| Analytics | the Plausible `data-domain` in `index.html` (for another tool, change `track()` in `script.js`) |
| Enable the AI card | set `data-ai-endpoint="/api/ritual-card"` on `.diag` in `index.html` and add `OPENAI_API_KEY` to your Vercel environment |

### Quiz logic

**Question 2 (the state you want) decides the blend.** Question 3 (the scent character you like) is recorded only as a preference signal; when the two disagree, the result shows a short note explaining the recommendation. The rule is implemented identically in `script.js`, `web-next/components/Diagnostic.tsx`, and `packages/ritual-card/src/blends.js`.

There are three blends: **Calm Basil** (settled focus), **Clear Mint** (clear mode), and **Energy Citrus** (fresh reset).

### Copy guidelines

The template describes the product only as a "switch" and a "preparation ritual". If you fork it, we recommend keeping these rules.

- Write about the situation, identity, and mood. Vocabulary: settle, clear, switch, prepare, ritual, routine.
- Do not use language that could read as a body metric, disease, or medical effect — stress relief, anxiety reduction, improved focus, treatment, efficacy. The claim guard in `@maum/ritual-card` checks generated copy against the same standard.
- Product classification (cosmetic, fragrance product, or otherwise) and labelling rules must be confirmed with the regulator or a specialist in your market before selling. This repository does not make that decision for you.

### Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for how, [ROADMAP.md](ROADMAP.md) for where the project is heading, and the [Code of Conduct](CODE_OF_CONDUCT.md).

---

## License

MIT © 2026 rio093. See [LICENSE](LICENSE).
