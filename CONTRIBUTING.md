# Contributing to webmc

## Branches

| Branch         | Purpose                                                               |
| -------------- | --------------------------------------------------------------------- |
| `main`         | Production. Auto-deploys to GitHub Pages. Only PR-merged.            |
| `dev`          | Integration. Daily PR auto-opens against `main` once CI is green.    |
| `feature/<x>`  | Short-lived feature branches; PR into `dev`.                         |
| `fix/<x>`      | Short-lived bugfix branches; PR into `dev`.                          |

## CI gates (run on every PR)

1. `npm run typecheck` — strict TypeScript.
2. `npm run lint` — ESLint.
3. `npm run format:check` — Prettier.
4. `npm run test` — 11593 Vitest unit + property tests.
5. `npm run test:e2e` — Playwright headless Chromium.

PRs cannot merge with red CI.

## Clean-room IP

This is a strict clean-room reimplementation:

- **Never** read decompiled Minecraft source code.
- **Never** commit Mojang textures, audio, or models.
- Behavioral references: `minecraft.wiki` (raw wikitext via `scripts/wiki-fetch.ts`) and
  user-supplied natural-language descriptions only.
- See `AGENT_CHARTER.md` for the full policy.

## Local dev

```bash
git clone https://github.com/jiangmuran/webmc.git
cd webmc
npm install
npm run dev
```

## Testing

```bash
npm run test           # unit
npm run test:watch     # unit, watch
npm run test:e2e       # playwright (requires `npm run test:e2e:install` once)
npm run bench:mesh     # mesh perf benchmark
```

## Commit style

- Lowercase prefix where useful: `fix:`, `perf:`, `feat:`, `refactor:`, `docs:`.
- One commit = one logical change. Don't bundle.
- The autonomous loop ships ~1 commit per minute under cron; that's fine.
