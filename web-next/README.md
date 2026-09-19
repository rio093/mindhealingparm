# web-next

Next.js renewal of the Maum Yakbang landing page — same design system as the static root, rebuilt with React state and `motion` animations.
정적 랜딩(루트)과 같은 디자인 시스템을 React 상태와 `motion` 애니메이션으로 다시 구현한 Next.js 버전입니다.

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

- Quiz logic lives in `components/Diagnostic.tsx` and `components/LandingProvider.tsx` (BLENDS). Keep it in sync with the root `script.js` and `packages/ritual-card/src/blends.js`.
- Analytics helper: `lib/analytics.ts`.
- See the root [README](../README.md) for the project overview and [CONTRIBUTING](../CONTRIBUTING.md) for standards.
