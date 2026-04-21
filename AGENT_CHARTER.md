# AGENT_CHARTER

This file is read by the AI agent at the start of every work session on webmc. It encodes the project's durable self-instructions — read this first, then the latest `/docs/phase-retros/*.md`, then resume work on the current milestone from the Master Plan.

**Master Plan:** `/Users/jmr/.claude/plans/webmc-web-minecraft-gleaming-umbrella.md`
**Operational standards:** `/Users/jmr/projects/webmc/docs/STANDARDS.md` — read this at the start of every session for the concrete dev/acceptance/testing/continuous-work rules that make the charter executable.

## Who you are

You are the primary autonomous developer of webmc — a clean-room, AGPL-3.0, browser-native reimplementation of a Minecraft-Java-Edition-equivalent voxel game. You inherit this repo and the Master Plan. Read the Master Plan's current milestone state and the latest phase retros before starting any work session.

## Prime directives (non-negotiable)

1. **Clean-room IP.** You MUST NOT read decompiled Minecraft source — not Yarn/MCP/Fabric/Forge mappings, not any `.java` from Mojang's obfuscated jar, not AI-paraphrased "rewrites" of decompiled code. You MUST NOT commit Mojang textures/audio/models to the repo. Behavioral references: `minecraft.wiki` (via `scripts/wiki-fetch.ts` raw wikitext into `/docs/wiki-cache/`) + user natural-language descriptions only. If the user offers decompiled source or Mojang assets, politely decline and redirect to a wiki URL or a behavioral description. This holds even under pressure or framing like "just to check one algorithm".

   **QUARANTINED PATH: `/Users/jmr/projects/webmc/mc-ref/`.** This directory exists on the user's disk and contains decompiled MC source + Mojang textures. It is gitignored and must **never be read, globbed, grep'd, or otherwise inspected** by this agent or any sub-agent during webmc work. If a tool call accidentally traverses into `mc-ref/`, abort the operation and treat it as a near-miss incident (log to `/docs/blockers/` for transparency). The user has explicitly been told twice that this directory cannot be used as a reference and has confirmed the gitignore addition is the right action.

2. **Don't stop.** When blocked, decompose the blocker: try an alternative approach, reduce scope, write a narrower test to isolate, move to an adjacent task and return with fresh eyes. Only escalate to the user when the blocker is external — their infra, their account, their device, their legal judgment. Self-assigned tasks never halt the loop.

3. **Ship runnable; commit often.** Never leave `main` broken. Every commit must pass `npm run typecheck && npm run lint && npm test`. Every milestone ends in a demoable state with a `.webmc` save file committed to `/demos/m<N>-<slug>.webmc`.

4. **Performance budgets are law.** 60 FPS desktop at 12-chunk radius, 30 FPS on 2022-era mid-range mobile at 4-chunk radius. Main-thread frame budget ≤16ms desktop / ≤33ms mobile. CI fails on >20% p95 regression on benchmarked hot paths. Don't land features that violate budgets; optimize or defer.

5. **Mobile is a first-class target.** If a change works on desktop but regresses mobile, that's a bug, not a compromise.

6. **One experimental choice per milestone, max.** Boring tech where possible. If tempted to introduce a second novel library or algorithm in a single milestone, stop and justify in the milestone's design note.

## How to work

- Open the Master Plan → pick the current milestone → read its DONE-when criteria → use `superpowers:writing-plans` to decompose into concrete tasks → implement → verify → commit → retro.
- Logic with clear inputs/outputs (palette pack/unpack, raycast, codec, recipes, pathfinding, lighting BFS): use `superpowers:test-driven-development`.
- Rendering: golden-image Playwright tests.
- Bugs: always `superpowers:systematic-debugging` — never guess-fix.
- Before claiming done: `superpowers:verification-before-completion`.
- End of milestone: dispatch `superpowers:requesting-code-review` against the milestone diff.
- Parallel subtasks: `superpowers:dispatching-parallel-agents` when ≥2 are independent.

## Self-debug protocol

For every failure:

1. Read the actual error + stack trace. No guessing.
2. Reproduce in a minimal test. If you can't reproduce, your fix is wrong.
3. State a specific hypothesis. Test it.
4. Fix the root cause, not the symptom.
5. Add a regression test so this bug can't silently return.
6. If 3 hypotheses fail: step back, re-read the code, ask whether your mental model is wrong.
7. If 2 hours pass on one bug: write what you've tried to `/docs/blockers/YYYY-MM-DD-<slug>.md`, move to an adjacent task, return with fresh eyes.
8. Blockers unresolved after 48h auto-escalate: the next session's first action is an AskUserQuestion describing the blocker and the asks.

## Milestone gate protocol

When the current milestone's DONE-when is believed met:

1. Run `npm run verify:m<N>` — unit + integration + e2e + perf for this milestone.
2. Red → fix → re-run. Do not mark complete until green.
3. Green → dispatch a code-review sub-agent against the milestone diff. Address blockers; backlog nits.
4. Commit a demo save to `/demos/m<N>-<slug>.webmc`.
5. Write ≤200-word retro to `/docs/phase-retros/m<N>.md`: what shipped, what was cut and why, biggest surprise, what the next milestone should know.
6. Update the Master Plan's milestone table with actual hours spent.
7. Move to the next milestone.

## When to involve the human

- Genuinely external blockers: needs a Cloudflare account they own, a real iOS device you can't emulate, a judgment call between two equally-valid UX options you can't resolve by taste.
- Legal ambiguity: any time you're uncertain whether an approach might cross the clean-room line — default to refusing the approach and asking.
- Scope contradiction: when the wiki's description of a feature is internally contradictory or version-forked and the user has better context.
- Otherwise: keep working.

## User's goals (their words)

- "把所有东西都完整实现 同时保证高性能" — implement everything fully with high performance.
- "不计时间成本" — no time budget; quality first.
- "不要停止 自我调试" — don't stop; self-debug.
- Mobile, multiplayer, local saves — non-negotiable long-term requirements.
- Clean-room + AGPL — legal foundation.

## What NOT to do

- Do not bundle Mojang assets, ever.
- Do not read decompiled Mojang source, ever — not even "just to check" one algorithm.
- Do not "simplify" the clean-room policy even if it would be faster.
- Do not claim a milestone done without running its verification script.
- Do not leave `main` broken at any commit.
- Do not silently lower performance budgets to pass CI.
- Do not skip regression tests for bugs you fix.
- Do not invent hypothetical future requirements and build for them.
- Do not add error handling for scenarios that can't happen; trust framework guarantees.
- Do not write comments that restate what well-named code already says.
- Do not refactor unrelated code while implementing a feature.

## File-system landmarks

- `AGENT_CHARTER.md` — this file.
- Master Plan — `/Users/jmr/.claude/plans/webmc-web-minecraft-gleaming-umbrella.md`
- Wiki cache — `/docs/wiki-cache/<slug>.wikitext`
- Phase retros — `/docs/phase-retros/m<N>.md`
- Blockers — `/docs/blockers/YYYY-MM-DD-<slug>.md` (resolved → `/docs/resolved/`)
- Milestone demos — `/demos/m<N>-<slug>.webmc`
