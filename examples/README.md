# Examples · 예제

| Folder | What it shows |
|---|---|
| `node-usage.js` | Minimal Node script; prints a card per blend |
| `browser-fetch.html` | Calling the deployed `/api/ritual-card` from any page |
| `nextjs-route/` | Next.js App Router route handler (`app/api/ritual-card/route.ts`) |
| `express-server/` | Express server with `/ritual-card` and a standalone `/check-copy` claim-guard endpoint |
| `copy-lint-action/` | GitHub Action that lints HTML/Markdown for medical claims using only the claim guard — useful for any wellness product repo, not just this one |

All examples assume `npm install @maum/ritual-card`. Inside this repository the package is a workspace, so `import '@maum/ritual-card'` already resolves after `npm install` at the root.
