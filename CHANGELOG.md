# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-09-19

First public release. The repository changes character from a personal landing-page repo to an open-source project others can fork.

### Added
- `@maum/ritual-card` (`packages/ritual-card`): zero-dependency module that generates a personalised one-minute ritual card from quiz answers via the OpenAI Responses API with strict JSON-schema output, a bilingual claim guard, and rule-based fallback. Includes CLI and `node:test` suite.
- `api/ritual-card.js`: Vercel serverless function exposing the module.
- Opt-in AI card in the landing quiz (`data-ai-endpoint` on `.diag`; off by default).
- `data-m` moment codes on quiz Q1 options.
- Bilingual (KO/EN) README, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `ROADMAP.md`, issue and PR templates.
- Root `package.json` with npm workspaces, `.env.example`, `.gitignore`.
- CI workflow `ci.yml` running module tests plus `web-next` lint and build.

### Changed
- README now documents three blends (Calm Basil, Clear Mint, Energy Citrus) to match the code; earlier text described two.

## [Unreleased]

### Added
- `@maum/ritual-card` published to npm; TypeScript declarations (`src/index.d.ts`); `publishConfig` with provenance.
- Examples: Next.js App Router route, Express server with `/check-copy`, GitHub Action copy linter built on the claim guard.
- `publish.yml` workflow (npm trusted publishing on GitHub Release).

See [ROADMAP.md](ROADMAP.md).

[0.1.0]: https://github.com/rio093/mindhealingparm/releases/tag/v0.1.0
