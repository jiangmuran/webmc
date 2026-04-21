# webmc Development, Acceptance & Testing Standards

Operational companion to `AGENT_CHARTER.md`. Where the charter says "do X," this document says "here is exactly what X means and how to verify it."

The goal: the agent runs autonomously for hundreds of hours toward complete MC-parity without human takeover. Every rule here is **observable, automatable, and failure-actionable** — when a check fails, the agent knows what to do without asking.

---

## 0. North Star

We are building: **a browser-native, clean-room, AGPL-3.0 voxel game that — feature by feature — matches the behavior of the current release of Minecraft Java Edition**, built entirely from `minecraft.wiki` + user descriptions, shipped with procedural placeholder art plus optional user-uploaded resource packs at runtime.

We stop when the milestone list is exhausted AND all green. We do not stop for partial progress. We do not stop because a task is hard.

---

## 1. Development Standards

### 1.1 Code

- **TypeScript strict** everywhere (`tsconfig.json` governs). No `any` without a `// eslint-disable-next-line` + comment explaining the escape. Prefer `unknown` and narrow.
- **No Mojang-origin inputs** ever enter the source tree. Never read `/mc-ref/`. Never grep or glob into it. Never ask a sub-agent to inspect it. If a tool call accidentally resolves there, abort and log to `/docs/blockers/` as a near-miss.
- **Data-driven over hard-coded**. Block/entity/recipe/loot-table definitions live in JSON under `/data/` with schemas validated at startup. New blocks require a new JSON entry, not a new branch of conditionals.
- **One experimental dependency per milestone, maximum.** "Experimental" means: not listed as a locked architecture choice in the Master Plan and not previously used in the project. Boring tech wins.
- **Small files, single responsibility.** A file doing two things is two files. A file > 400 LoC invites refactoring as part of the next touch.
- **Named constants for magic numbers** that come from the wiki. `const DUST_MAX_POWER = 15;` not `15`. The name makes the wiki reference visible in the code.
- **No error handling for impossible cases.** Trust framework guarantees; only validate at system boundaries (user input, network, disk, worker message decoding). Do not defensively wrap internal calls in try/catch for scenarios that logic proves cannot occur.
- **Comments are rare and purposeful.** Only write a comment when the _why_ is non-obvious (a workaround for a specific wiki quirk, a chosen deviation, a subtle invariant). Never restate what well-named code already says.

### 1.2 Architecture discipline

- Respect the module boundaries in the Master Plan (`/src/engine` never imports `/src/game`, etc.). Cross-boundary use requires elevating the shared piece to a lower layer.
- Heavy work runs in Web Workers. Main thread does input, render dispatch, UI. Every task that could exceed a 4 ms main-thread slice must move to a worker or be time-budgeted.
- Performance budgets are law (see §5). Any landing that regresses a budget by >20% p95 must be reverted or fixed in the same change set.

### 1.3 Commits & branches

- Commit on green: `typecheck + lint + format + unit` must all pass before every commit. Use `npm run ci` locally to confirm.
- Commit messages: imperative present tense, ≤ 72 chars subject, optional body explaining _why_ when non-trivial. Reference milestone as `M<N>:` prefix. Example: `M3: propagate sky light across chunk borders`.
- Never `git add -A` blindly. Always review the file list; verify `mc-ref/` and `.env` are not staged.
- No `--no-verify`. No `--amend` unless the commit is unpushed and the amend is within the same atomic change.
- One concept per commit. "Fix X and refactor Y" is two commits.

### 1.4 What the agent does NOT do on its own

- Install a new major dependency without justifying it in the milestone's design note.
- Change a locked architecture choice from the Master Plan without adding a dated "architecture change" entry to that document.
- Disable a test instead of fixing it. `test.skip` / `it.todo` is a blocker; write it up and move on to an adjacent task.
- Lower a performance budget to "pass" CI. Budgets are immovable until explicitly renegotiated by the user.
- Commit anything under `/Users/jmr/projects/webmc/mc-ref/`, whether staged by accident or on purpose.

---

## 2. Acceptance Standards

### 2.1 What "DONE" means for a milestone

A milestone is DONE when **all five** are true:

1. **DONE-when criteria met.** The Master Plan's DONE-when paragraph for this milestone can be demonstrated in a browser within 5 minutes by a reviewer who only reads that paragraph.
2. **`npm run verify:m<N>` exits 0.** This script chains typecheck + lint + format + unit + e2e + perf for the milestone. Red → fix → re-run. Never mark DONE on red.
3. **Code-review sub-agent has reviewed the milestone diff.** All blocker-severity findings are fixed; non-blocker findings are either fixed or logged to `/backlog.md` with a reason.
4. **Demo save committed.** `/demos/m<N>-<slug>.webmc` can be loaded and demonstrates the milestone's headline feature.
5. **Phase retro written.** `/docs/phase-retros/m<N>.md` is ≤ 200 words, includes actual hours vs estimate, what was cut and why, biggest surprise, and a one-sentence "next milestone should know…".

Partial credit is not credit. A milestone with 4 of 5 is NOT done; it blocks M<N+1>. The agent does not advance on partial completion.

### 2.2 Feature parity with Minecraft Java Edition

webmc targets behavioral equivalence with the **most recent release cited on `minecraft.wiki`** (the wiki cache is refreshed at the start of each content milestone via `scripts/wiki-fetch.ts --refresh`). "Parity" means:

- Same block/entity/item behavior within the numeric tolerances given by the wiki (tick exact where the wiki gives tick-exact numbers; visual tolerance where the wiki only gives qualitative description).
- Same player-facing UX for crafting, inventory, progression.
- Same world-generation invariants (biome distribution, ore curves, structure placement rules) — bit-exact seed reproducibility is NOT required, only statistical equivalence over N=100 seeds.

Not required for parity: Java-protocol compatibility, Anvil save compatibility, bundled Mojang art/audio, exact rendering pipeline (we choose our own shaders and atlases).

### 2.3 Milestone dependency rule

A milestone may not start until the previous milestone is DONE per §2.1. Exception: cosmetic/content milestones (M18+) can be reordered if the dependency DAG permits, but the reorder must be recorded in the Master Plan.

### 2.4 Escalation ladder (when the agent asks the user)

Before asking, the agent has worked the problem for **at least** the time listed:

| Problem class                                                  | Try for     | Then                                                                       |
| -------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| Compile/lint/type error                                        | 15 min      | keep trying, this is always self-solvable                                  |
| Test failure, clear error message                              | 30 min      | keep trying                                                                |
| Test failure, unclear cause                                    | 2 h         | log to `/docs/blockers/` and move to adjacent task; return with fresh eyes |
| Perf regression                                                | 4 h         | log + consider architectural alternatives; return next session             |
| External infra blocker (needs user's account, device, API key) | immediately | AskUserQuestion; work unrelated tasks while waiting                        |
| Wiki contradiction / version ambiguity                         | immediately | AskUserQuestion with the specific wiki URL and the interpretations         |
| Clean-room question (is X allowed?)                            | immediately | default to refusing the approach and ask                                   |
| Any blocker unresolved for 48 h since logged                   | —           | next session's first action is AskUserQuestion                             |

**The agent does not escalate to request permission for work the charter already authorizes.** Proceeding with M7 after M6 is done is authorized; asking "should I start M7?" is forbidden.

---

## 3. Testing Standards

### 3.1 Coverage per code category

| Category                                                                 | Tool                             | Minimum                                             | Example                                        |
| ------------------------------------------------------------------------ | -------------------------------- | --------------------------------------------------- | ---------------------------------------------- |
| Pure logic (palette, raycast, codec, recipes, pathfinding, lighting BFS) | Vitest unit                      | 95% line coverage, all branches hit                 | `SubChunk.test.ts` round-trip set/get          |
| Data-structure invariants                                                | fast-check property              | 3+ property tests per structure                     | "any block set then get yields the same block" |
| Worker message contracts                                                 | Vitest unit (mocked postMessage) | 100% of message types encode/decode round-trip      | mesher worker request/response                 |
| Render output                                                            | Playwright golden-image          | 1 fixed-seed scene per milestone, ≤ 0.5% pixel diff | chunk of blocks in sunlight                    |
| User flows                                                               | Playwright e2e                   | 1 scenario per milestone mirroring DONE-when        | "place a torch, it lights the cave"            |
| Performance hot paths                                                    | benchmark harness                | CI fails > 20% p95 regression                       | 16³ chunk mesh time                            |

Code lacking a test in its category must be tested or deleted. There is no "I'll test it later."

### 3.2 Test hygiene

- **No mocked dependencies** for logic layers (palette, lighting, mesher) — integration test them together with real data.
- **Integration tests** for worker interactions use real workers, not mocked. Vitest supports this.
- **No skipped or `.only` tests** in the committed tree. CI rejects if found.
- **Golden images** are checked in. Regenerating a golden requires a one-line reason in the commit body.
- **Flaky tests** are bugs. Fix root cause; do not retry-mask. If flake source is proven environmental and unavoidable (e.g., a real network service), isolate it behind a `@flaky` tag and exclude it from the default test run.

### 3.3 Regression tests

Every bug fix commits a regression test that fails without the fix and passes with it. The test references the bug in its name: `it('survives M3 cross-chunk light seam regression', ...)`. No regression test → no commit.

### 3.4 Perf regression testing

Benchmarks live under `tests/perf/`. Each is isolated (no shared state), runs 100 iterations, reports p50/p95 to JSON. CI stores the latest run as an artifact; comparison against the previous commit fails if any perf metric regresses > 20% at p95.

New benchmarks are added whenever a new hot path is introduced (chunk mesh, light propagation, codec encode, physics step, mob tick, A\* pathfinding).

---

## 4. Continuous-Work Protocol

How the agent decides whether to keep going or stop.

### 4.1 Per-task decision tree

```
Did the last action succeed?
├── Yes → mark task done → pick next task from current milestone → continue.
└── No → read error → is it novel or repeated?
    ├── Novel (first time this session) → form specific hypothesis → fix → retry.
    ├── Repeated (2nd attempt at same error) → re-read code; mental model probably wrong.
    ├── 3rd attempt → step back; consider architectural alternative.
    ├── 4th attempt → log to /docs/blockers/ and switch to adjacent task.
    └── Any attempt reveals external blocker → escalate per §2.4.
```

### 4.2 Per-milestone close-out

When current milestone's tasks are all done:

1. Run `npm run verify:m<N>`.
2. Dispatch `superpowers:requesting-code-review` against milestone diff.
3. Address blockers from review.
4. Commit the milestone demo save.
5. Write phase retro.
6. Open the next milestone; keep working.

The agent does NOT:

- Ask the user "shall I start M<N+1>?"
- Post a long summary and wait.
- Re-verify the plan is still right (unless the retro surfaced a genuine contradiction with reality).

### 4.3 Blocker handling

Format of `/docs/blockers/YYYY-MM-DD-<slug>.md`:

```markdown
# <one-line problem>

**First hit:** <timestamp, how long spent so far>
**Category:** compile | test | perf | infra | wiki-ambiguity | clean-room

## Reproduction

<minimal failing test or steps>

## Hypotheses tried

- H1: <description> → outcome
- H2: <description> → outcome

## Next ideas

- <idea>, <idea>
```

A blocker auto-escalates (becomes an AskUserQuestion for the next session) after 48 h of the file existing. When resolved, move the file to `/docs/resolved/` with a root-cause one-liner appended.

### 4.4 Don't-stop rules (explicit)

The agent MUST NOT pause the loop for any of these reasons:

- "This task feels big" → decompose per §4.1.
- "I want user approval on a design choice" → if the Master Plan locks the choice, proceed; if not locked and low-stakes, pick by convention and note it in the phase retro; if high-stakes, ask via AskUserQuestion and continue other work.
- "Milestone is going over-budget" → hours are estimates. Quality > speed. Continue.
- "The wiki is confusing" → log as a wiki-ambiguity blocker; move to adjacent task; return next session.
- "I'm not sure if this is pretty enough" → aesthetic judgments are user's; default to boring and ship.

The agent MUST stop the loop only for:

- Clean-room legal question uncertainty.
- External infra blocker (user's account, device, API key).
- 48 h unresolved blocker that has exhausted all hypotheses.
- User explicit request to pause.

---

## 5. Performance Budgets (CI-enforced)

| Target                             | Desktop (Chrome latest) | Mobile (reference: iPhone 12 / Pixel 6) |
| ---------------------------------- | ----------------------- | --------------------------------------- |
| Steady-state FPS                   | ≥ 60 at 12-chunk radius | ≥ 30 at 4-chunk radius                  |
| Main-thread frame budget (p95)     | ≤ 16 ms                 | ≤ 33 ms                                 |
| Cold load → playable               | ≤ 3 s                   | ≤ 6 s                                   |
| Chunk mesh (16³, worker)           | ≤ 20 ms p95             | ≤ 40 ms p95                             |
| Light BFS propagation (1 chunk)    | ≤ 10 ms p95             | ≤ 25 ms p95                             |
| Codec encode/decode (1 KB message) | ≤ 0.2 ms p95            | ≤ 0.5 ms p95                            |
| IndexedDB chunk write (zstd)       | ≤ 5 ms p95              | ≤ 15 ms p95                             |

CI fails if any measured p95 regresses > 20% vs the previous `main` commit. Mobile numbers are measured in Playwright's Pixel-7 emulation, acknowledging emulation is a floor not a ceiling.

---

## 6. Quarantine Rules

`/Users/jmr/projects/webmc/mc-ref/` is off-limits. Verified by:

- `.gitignore` excludes `mc-ref/` (commit-side protection).
- This document (+ charter + plan + memory) disallows reading it (agent-side protection).
- All sub-agent dispatches must state in the prompt: "Do not traverse into mc-ref/."
- Any tool call result that includes a path under `mc-ref/` must be treated as a near-miss: abort the operation, log the incident to `/docs/blockers/NEAR-MISS-YYYY-MM-DD-<slug>.md`, and continue with an alternative approach.

---

## 7. How this document evolves

STANDARDS.md changes rarely, in these cases only:

- A genuinely new class of work appears (e.g., we add a native-app wrapper and need native-build standards).
- A rule has proven wrong or unenforceable; the change is recorded in the commit with a dated "Rule change" section at the bottom of this file.
- The user explicitly revises a rule.

Routine improvements (fixing a link, tightening a sentence) do not need ceremony; substantive rule changes do.
