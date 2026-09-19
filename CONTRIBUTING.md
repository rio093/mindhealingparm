# Contributing · 기여 안내

🇰🇷 [한국어](#한국어) · 🇬🇧 [English](#english)

---

## 한국어

이 프로젝트에 관심 가져 주셔서 고맙습니다. 오타 수정부터 새 블렌드 로직까지 어떤 규모의 기여든 환영합니다.

### 어디서 시작할까요

- 처음이라면 `good first issue` 라벨이 붙은 이슈를 보세요.
- 큰 변경(새 섹션, 새 모듈, 디자인 시스템 변경)은 작업 전에 이슈를 먼저 열어 방향을 맞춥니다. 방향은 [ROADMAP.md](ROADMAP.md)에 있습니다.
- 버그는 이슈 템플릿에 재현 절차와 브라우저·Node 버전을 적어 주세요.

### 개발 환경

```bash
npm install
npm run dev     # 정적 랜딩 http://localhost:8765
npm test        # packages/ritual-card 테스트
```

Next.js 버전은 `web-next/`에서 `npm install && npm run dev && npm run lint`.

### 변경 기준

**랜딩 페이지 (`index.html`, `styles.css`, `script.js`)**

- 빌드 도구를 추가하지 않습니다. 정적 파일 세 개로 동작해야 합니다.
- 외부 의존성을 추가하지 않습니다. 필요하면 이슈에서 먼저 논의합니다.
- `prefers-reduced-motion`, 키보드 포커스, `aria-*` 속성을 유지합니다.
- 설정값은 한 곳에서만 읽습니다(예: 폼 엔드포인트는 `<form action>`, AI 엔드포인트는 `data-ai-endpoint`).

**카피**

- README의 카피 가이드를 따릅니다. 신체 지표·질환·의학적 효과로 읽힐 수 있는 표현은 받지 않습니다.
- 확신이 없으면 `npm run card`의 클레임 가드에 문구를 넣어 보세요. `packages/ritual-card/src/guard.js`의 패턴에 걸리면 다른 표현으로 바꿉니다.

**`packages/ritual-card`**

- 런타임 의존성 0을 유지합니다.
- 새 동작에는 `test/`에 테스트를 추가합니다. 실제 API를 호출하는 테스트는 넣지 않습니다(`fetch` 주입으로 모킹).
- 폴백 카드와 클레임 가드는 모든 변경 후에도 통과해야 합니다.

### 커밋과 PR

- 브랜치: `feat/…`, `fix/…`, `docs/…`
- 커밋 메시지는 한국어·영어 모두 괜찮습니다. 첫 줄은 72자 이내로 "무엇을 왜"를 적습니다.
- PR 템플릿의 체크리스트를 채워 주세요. CI(모듈 테스트 + web-next lint/build)가 통과해야 머지합니다.
- 화면이 바뀌면 스크린샷을 첨부합니다.

### 라이선스

기여한 코드는 이 저장소의 MIT 라이선스로 배포되는 데 동의한 것으로 봅니다.

---

## English

Thanks for your interest. Contributions of any size are welcome, from a typo fix to new blend logic.

### Where to start

- New here? Look for issues labelled `good first issue`.
- For larger changes (a new section, a new module, design-system changes) open an issue first so we can agree on direction. See [ROADMAP.md](ROADMAP.md).
- For bugs, use the issue template and include reproduction steps plus browser and Node versions.

### Development

```bash
npm install
npm run dev     # static landing at http://localhost:8765
npm test        # packages/ritual-card tests
```

Next.js version: in `web-next/`, run `npm install && npm run dev && npm run lint`.

### Standards

**Landing page (`index.html`, `styles.css`, `script.js`)**

- No build tooling. It must keep working as three static files.
- No external dependencies. Discuss in an issue first if you think one is needed.
- Keep `prefers-reduced-motion`, keyboard focus, and `aria-*` attributes intact.
- Read each setting from exactly one place (form endpoint from `<form action>`, AI endpoint from `data-ai-endpoint`).

**Copy**

- Follow the copy guidelines in the README. We do not accept language that could read as a body metric, disease, or medical effect.
- Not sure? Run the phrase through the claim guard (`npm run card` or `findClaimViolation` in `packages/ritual-card/src/guard.js`) and rephrase if it matches.

**`packages/ritual-card`**

- Keep zero runtime dependencies.
- Add tests in `test/` for new behaviour. Do not add tests that call the real API; inject `fetch` to mock it.
- The fallback cards and the claim guard must still pass after every change.

### Commits and pull requests

- Branches: `feat/…`, `fix/…`, `docs/…`
- Commit messages in Korean or English are both fine. Keep the first line under 72 characters and say what and why.
- Fill in the PR template checklist. CI (module tests + web-next lint/build) must pass before merge.
- Attach screenshots for visual changes.

### License

By contributing you agree that your contributions are licensed under this repository's MIT License.
