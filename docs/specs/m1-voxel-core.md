# M1 — Voxel Core (Design Note)

**Master Plan reference:** M1 — `~25h`. DONE-when = walk/fly an 8×8 chunk grid of colored cubes at 60 FPS desktop with p95 chunk-mesh time < 20 ms.

This note decomposes M1 into concrete sub-tasks with owners, data shapes, and verification hooks before any implementation begins. Read `AGENT_CHARTER.md` + `docs/STANDARDS.md` first; read `docs/wiki-cache/Chunk_format.wikitext` for invariants we are matching (chunk dimensions, palette approach) and `docs/wiki-cache/Block_states.wikitext` for block-state modeling.

**Clean-room reminder:** the wiki describes Minecraft's chunk format. We match its _behavior_ (16×16 horizontal, 384 vertical, palette-encoded block storage) but our on-disk and in-memory layouts are webmc's own choices. Do NOT read `/mc-ref/`.

## Sub-tasks

Ordered by dependency. Each is ≤ 3 h. Tasks with the same indent level are parallelizable.

```
M1.1  Block id & BlockState types, registry stub        [1h]  serial
M1.2  Palette (encode/decode/resize) + unit tests       [2h]  parallel-1
M1.3  SubChunk (16³) get/set with palette backing       [2h]  parallel-1
M1.4  Chunk (16×16×384, 24 sub-sections) container      [1h]  ← needs 1.3
M1.5  World (chunk map, coord math)                     [1h]  ← needs 1.4
M1.6  Binary greedy mesher (pure fn, tested in Node)    [4h]  parallel-2
M1.7  Mesher Worker (wraps 1.6, postMessage contract)   [2h]  ← needs 1.6
M1.8  ChunkRenderer (Three BufferGeometry upload)       [2h]  ← needs 1.7
M1.9  ChunkShader (minimal: per-vertex color + AO)      [2h]  parallel-3
M1.10 First-person camera + pointer lock                [1h]  parallel-3
M1.11 AABB-vs-voxel collision + walk/fly modes          [3h]  ← needs 1.5, 1.10
M1.12 Debug HUD upgrade (chunk count, tri count, pos)   [0.5h] any time
M1.13 Perf bench harness: mesh 100× of a fixture chunk  [1.5h] parallel-2
M1.14 Playwright e2e: walkaround scenario + FPS check   [1h]  last
M1.15 verify:m1 script + retro + demo save              [1h]  last
```

Honest total ~25 h, with ±30% uncertainty.

## Data shapes (fixed before 1.2)

```ts
// src/blocks/state.ts
export type BlockId = number; // runtime id into BlockRegistry
export interface BlockState {
  readonly id: BlockId;
  readonly props: number; // packed state (orientation, age, etc.); 0 = default
}

// src/world/Palette.ts
export class Palette {
  readonly entries: BlockState[]; // small array, typically ≤ 32
  readonly bitsPerIndex: 0 | 4 | 8 | 16;
  add(s: BlockState): number; // returns index
  indexOf(s: BlockState): number | -1;
  encode(i: number, indices: Uint32Array, at: number): void;
  decode(indices: Uint32Array, at: number): BlockState;
}

// src/world/SubChunk.ts  (16×16×16 = 4096 blocks)
export class SubChunk {
  readonly palette: Palette;
  readonly indices: Uint32Array | null; // null = single-block (palette[0]) subchunk
  get(x: number, y: number, z: number): BlockState;
  set(x: number, y: number, z: number, s: BlockState): void;
  version: number; // bumps on mutation, used for mesh dirty-tracking
}

// src/world/Chunk.ts
export class Chunk {
  readonly cx: number;
  readonly cz: number;
  readonly sections: (SubChunk | null)[]; // length 24 (y ∈ [0, 384])
  get(lx: number, y: number, lz: number): BlockState; // chunk-local coords
  set(lx: number, y: number, lz: number, s: BlockState): void;
  meshDirty: Set<number>; // subchunk y-indices needing remesh
}
```

## Worker contract (fixed before 1.7)

```ts
// Main → Worker
interface MeshRequest {
  type: 'mesh';
  requestId: number;
  cx: number;
  cy: number; // subchunk y-index [0, 23]
  cz: number;
  self: ArrayBuffer; // transferable snapshot: palette entries + Uint32 indices + header
  neighbors: {
    [dir: string]: ArrayBuffer | null; // nx, px, ny, py, nz, pz, six transferables
  };
}

// Worker → Main
interface MeshResponse {
  type: 'mesh-result';
  requestId: number;
  cx: number;
  cy: number;
  cz: number;
  positions: Float32Array;
  normals: Int8Array;
  colors: Uint8Array; // 4 bytes/vertex: r,g,b,aoShade
  indices: Uint32Array;
  elapsedMs: number; // for perf bench
}
```

All five typed arrays are transferables. No GC churn on either side.

## Test plan (per category, per STANDARDS.md §3.1)

- **Unit (Vitest):** Palette round-trip (empty → add 32 → lookup all), SubChunk.set then .get yields same state, Chunk cross-subchunk coordinate math, mesher on hand-crafted 2×2×2 fixture produces expected face count.
- **Property (fast-check):** for any random 4096-block pattern, mesh output has no duplicate faces, no orphan vertices; SubChunk set/get is idempotent; palette encode/decode round-trips losslessly for any valid block set ≤ 65536 entries.
- **Golden-image (Playwright):** fixed seed renders a 2×2 chunk grid with a specific camera; diff ≤ 0.5% vs checked-in PNG.
- **e2e (Playwright):** boot → pointer-lock → WASD forward 2 s → FPS still ≥ 55 desktop (≥ 25 mobile emulation); no console errors.
- **Perf (tests/perf/):** mesh benchmark — run 100 iterations of meshing a fixture SubChunk, report p50/p95 ms. CI fails on > 20% p95 regression vs the previous commit.

## Open questions

- **Vertex format for M1:** start simple with `[posX, posY, posZ, colorIdx]` (palette-index coloring, no atlas UVs yet — atlas is M2). Keep room in the shader for UVs later without changing the mesher.
- **Neighbor awareness in mesher:** need neighbor subchunks to avoid rendering hidden faces at chunk borders. Worker receives 6 neighbor snapshots; if `null`, assume empty-air neighbor (renders the face).
- **Coord convention:** right-handed Y-up (matches Three.js and MC). World coords: y ∈ [0, 384), any x,z ∈ ℤ.

## Definition of DONE (maps to STANDARDS.md §2.1)

1. `npm run dev` → pointer-lock → walk with WASD+Space+Shift → 60 FPS desktop, 30 FPS mobile emulation. No seams between chunks. No interior faces visible when flying beneath terrain.
2. `npm run verify:m1` green: typecheck + lint + prettier + unit (new) + property (new) + e2e walkaround + golden-image + perf bench (p95 mesh < 20 ms).
3. Code-review sub-agent reviews M1 diff; blockers fixed; nits backlogged.
4. `/demos/m1-flat-grid.webmc` demo save committed — loads the 8×8 flat grid fixture for reviewer.
5. `/docs/phase-retros/m1.md` written with actual hours and surprises.

## Risks & fallbacks

- **Mesher is slow in pure JS:** binary greedy meshing is the target, but if mid-mobile perf suffers, fall back to classic greedy first; binary becomes an M1.5 micro-milestone.
- **Worker message cost dominates:** if postMessage transfer > 0.2 ms on mid-range phone for 8 KB subchunks, plan SAB migration as part of M16 (already in the plan).
- **Floating-point seams between chunks:** snap all quad vertex positions to integer in the mesher, debug by rendering wireframe over filled at an overlap zone.
