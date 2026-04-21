# M3 — Terrain, Lighting, Day-Night (Design Note)

**Master Plan reference:** M3 — `~25h`. DONE-when = fly over infinite terrain at 60 FPS; caves are dark; dusk/dawn transitions smoothly; same seed → same chunks.

Read: `AGENT_CHARTER.md` + `docs/STANDARDS.md` + `docs/phase-retros/m2.md`. Wiki refs (already cached): `Biome.wikitext`, `Light.wikitext`, `Chunk_format.wikitext`. Fetch `World_generation.wikitext` at M3.0 for gen invariants.

Clean-room: algorithms described in public papers (Simplex/OpenSimplex by Ken Perlin, open-source by Kurt Spencer) are fine to implement from the papers. Behavioral parameters (surface y-ranges, tree density, ore depth curves) are read from `minecraft.wiki` and transcribed as named constants — never copy-pasted from `mc-ref/`.

## Sub-tasks

```
M3.1  Simplex-style noise (2D + 3D, seeded, tileable)       [2h]   pure fn, tested
M3.2  Heightmap worldgen + 2 biomes + trees                 [4h]   WorldGenerator class
M3.3  Chunk streaming (load/unload around player)           [3h]   ChunkLoader w/ radius
M3.4  Sky-light BFS propagation                              [3h]   lighting.ts
M3.5  Block-light BFS (glowstone/ore, plus torch when M8)   [2h]   lighting.ts
M3.6  Vertex AO in mesher                                   [2h]   3-neighbor sample
M3.7  Day-night cycle (sun angle + fog + shader uniforms)   [1.5h] DayNight ticker
M3.8  Seed reproducibility test                             [0.5h] snapshot-style
M3.9  Playwright e2e (flyover, darkness under overhang)     [1h]
M3.10 verify:m3 + retro + close                             [1h]
```

Honest total ~19 h. ±30% uncertainty covers the light-seam bug factory.

## Public-algorithm noise

Use OpenSimplex2 (successor to Simplex, Kurt Spencer, public domain). Implementation:

- `src/world/noise/simplex2.ts` — `noise2(x, z)`, `noise3(x, y, z)`, seeded via a 32-bit mulberry PRNG that shuffles the permutation table at construction.
- Tests: determinism (same seed + coords → same value), range (≈ [-1, 1]), coverage (no flat zones in a 256×256 sample).

## Generation pipeline

```ts
class WorldGenerator {
  constructor(readonly seed: number, readonly registry: BlockRegistry) {}
  generateChunk(cx: number, cz: number, chunk: Chunk): void;
}
```

Per column `(wx, wz)`:

1. Sample `heightNoise = simplex2(wx / 80, wz / 80)` → surface Y in `[48, 96]`.
2. Sample `biomeNoise` — low-frequency second noise. Threshold partitions into `PLAINS` and `FOREST`.
3. Fill voxels y=0..surface-4 with stone, surface-3..surface-1 with dirt, surface with grass.
4. FOREST columns with `(wx, wz)` hashed against a density constant place an oak tree.

Tree placement: deterministic `hash32(seed ^ wx ^ wz)` per column; if `< TREE_DENSITY`, plant a tree. Tree shape: 4-tall log + 3-layer leaf canopy (5×5, 3×3, 1×3 cross). All blocks committed via `chunk.set()` so palette + meshDirty propagate correctly.

## Chunk streaming

`ChunkLoader.update(playerWx, playerWz)` every frame:

- Compute `(playerCx, playerCz)`.
- For every `(cx, cz)` within view radius `R` and not already loaded, queue gen.
- For every loaded `(cx, cz)` > `R + 1` from player, unload (remove from world + renderer).
- Generation runs synchronously on main thread for M3; promoting to a worker is M16 work.
- Cap generated-per-frame to avoid stutter; budget 4 new chunks per frame.

## Lighting

Both lights live on SubChunk as additional nibble-packed Uint8Arrays (`skyLight`, `blockLight`). For M3 we store them as flat `Uint8Array(4096)` — nibble packing is a perf micro-opt deferred to post-M3.

BFS propagation when a block changes:

- Sky light: initialize by column flood from `y = CHUNK_HEIGHT-1` down until hitting opaque.
- Block light: each emissive block seeds with its `lightEmission`; propagate with attenuation of 1 per step; stop at 0.
- Cross-chunk: when the BFS queue hits a chunk border, check the neighbor — if loaded, push into its queue and mark it for re-mesh.

Mesher snapshot grows by two `Uint8Array` fields (`flatSkyLight`, `flatBlockLight`). Quad emission bakes `vertexLight = max(sky, block)` across the four vertex corners and writes it into the `colors.a` channel that's been reserved since M1.

## Vertex AO

Per-vertex ambient-occlusion using the 3-neighbor rule: for a corner, sample the 3 voxels adjacent to that corner (two edge-adjacent, one diagonal). Count solids; map `0 → 1.0, 1 → 0.75, 2 → 0.5, 3 → 0.25`. Multiply into vertex shade (`colors.a`) alongside light value.

## Day-night

```ts
class DayNightCycle {
  dayLengthSec: number; // 600 (10 min)
  angleRad: number;     // derived from (elapsedSec / dayLengthSec) * 2π
  sunDir: Vector3;      // shader uniform
  skyColor: Color;      // shader uniform, lerped day↔dusk↔night
  fogColor: Color;
  fogNear: number;
  fogFar: number;
}
```

Shader uniform updates each frame. Sun dips below horizon → sky fades to navy, fog color matches, block-light becomes the dominant term at night.

## Seed reproducibility test

Vitest: generate chunks `(0,0)`, `(3,-2)`, `(-7,5)` with seed `42`. Record the block at 16 fixed (x,y,z) samples. Re-run → same results. Tolerance: exact match.

## DONE (per STANDARDS.md §2.1)

1. `npm run dev` → fly forward for 30 s → new chunks stream in without a single stutter > 50 ms. Dig a cave, it's dark. Wait 10 minutes, a full day passes smoothly.
2. `npm run verify:m3` green: all prior + noise unit + gen seed-reproducibility + lighting BFS unit + flyover e2e.
3. Review sub-agent sign-off.
4. `/demos/m3-terrain.md` notes.
5. Retro.

## Risks

- **Cross-chunk light seams** are the #1 bug factory in every voxel engine. Unit-test the BFS with fixtures that span a chunk border. If it slips, ship with per-chunk light only and fix in M3.5-followup.
- **Streaming stutter** on mobile if gen is too slow. Mitigation: 4-chunks-per-frame cap + profiling run at M3.3 halfway.
- **PNG-like seed portability.** A 32-bit seed limits distinct worlds to ~4B. Fine for M3; upgrade to 64-bit if M5's world selector grows.
