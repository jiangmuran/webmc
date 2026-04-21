# M2 — Block Interaction + Atlas (Design Note)

**Master Plan reference:** M2 — `~15h`. DONE-when = free-build creative on a flat world; blocks are textured; grass has distinct top/side/bottom.

Read: `AGENT_CHARTER.md` + `docs/STANDARDS.md` + `docs/phase-retros/m1.md`. Wiki refs (cached under `/docs/wiki-cache/`): `Block_states.wikitext`, `Grass_Block.wikitext` (for per-face behavior) and `Texture.wikitext` (fetch in M2.0 if needed).

Clean-room reminder: textures are **all project-authored procedural**; no Mojang art enters the repo. M4+ lets users upload their own resource packs.

## Sub-tasks

```
M2.1  DDA voxel raycast                                  [2h]  pure fn, tested in Node
M2.2  Place/break via raycast + hold-repeat              [2h]  needs 2.1 + World mutable edits
M2.3  Expand BlockRegistry to ~30 blocks                 [1h]  JSON-backed defs, per-face uv keys
M2.4  Procedural atlas generator                         [3h]  noise + palette per family; PNG+JSON UV map
M2.5  Mesher emits per-face UVs; shader samples atlas    [3h]  vertex attr expansion
M2.6  Hotbar UI (9 slots, number + scroll select)        [1.5h] DOM+CSS overlay
M2.7  World→ChunkRenderer dirty pipeline                 [1h]   subscribe to World mutations
M2.8  Skybox gradient + fog tuning                       [0.5h] already partial in M1
M2.9  Playwright place/break scenario                    [1h]
M2.10 verify:m2 + retro + demo                           [1h]
```

Honest total ~16h, ±30%.

## Data shape additions

```ts
// Expand BlockDef with per-face texture keys:
export interface BlockDef {
  readonly name: string;
  readonly solid: boolean;
  readonly opaque: boolean;
  readonly lightEmission: number;
  readonly hardness: number;
  readonly textures: {
    readonly top: string;
    readonly bottom: string;
    readonly side: string;
    // Optional fine-grained overrides: north/south/east/west
  };
}
```

Textures are string keys into the atlas JSON map (`{key -> [u0, v0, u1, v1]}`).

## Atlas

- 16×16 tile grid in a single 512×512 PNG (32 tiles squared = 1024 slots, plenty).
- Generator reads a palette-description JSON and emits:
  - `/public/assets/atlas.png` (compiled to bundle at build-time)
  - `/public/assets/atlas.json` (`{ "stone": [0/32, 0/32, 1/32, 1/32], ... }`)
- `scripts/gen-atlas.ts` — idempotent, content-hash verify; CI fails if committed atlas drifts from source defs.

## Vertex format upgrade

Add a 2nd attribute pair:

```ts
interface MeshOutput {
  positions: Float32Array;    // x,y,z per vertex (unchanged)
  normals: Int8Array;         // nx,ny,nz (unchanged)
  colors: Uint8Array;         // r,g,b,ao (keeps AO-alpha open for M3)
  uvs: Float32Array;          // u, v per vertex  ← NEW
  indices: Uint32Array;
  quadCount: number;
}
```

Shader: sample atlas texture with `texture2D(uAtlas, vUv) * lighting`. Colors become a *tint* for biome-colored blocks (grass/leaves in M3); until then they are a neutral white fallback.

## Raycast contract

```ts
export interface RayHit {
  bx: number; by: number; bz: number;   // block coord of hit voxel
  face: 0 | 1 | 2 | 3 | 4 | 5;          // which face (-x +x -y +y -z +z)
  distance: number;
}

export function raycastVoxels(
  origin: Vec3Lite,
  dir: Vec3Lite,
  maxDistance: number,
  isSolid: (x,y,z) => boolean,
): RayHit | null;
```

Amanatides-Woo algorithm. Fast in pure JS; no allocations in the step loop.

## Test plan

- Unit: raycast on fixed grids (hit directly-above, hit to the side, miss over maxDistance, ray starts inside solid — undefined or returns start?).
- Property: for any random dir and max=32, hit is always the *first* solid voxel along the ray.
- Golden-image: atlas-based mesher output vs committed PNG, per block def.
- e2e: boot → pointer-lock → place a block in front → walk past → look back → block persists and is textured.

## Risks

- **Atlas-gen determinism:** noise-generated textures must be reproducible across machines, otherwise the committed PNG drifts on every contributor. Use a fixed seed per block-family and snapshot the PNG once; gen script verifies the hash of the committed file instead of regenerating.
- **Shader texture binding on Safari:** sampler uniforms in ShaderMaterial sometimes need an explicit `map` slot. Test on iOS Safari early; fall back to `RawShaderMaterial` if Three's auto-prepend clashes.

## DONE (per STANDARDS.md §2.1)

1. `npm run dev` → flat world → 9-slot hotbar works (numbers + scroll) → left-click breaks, right-click places from selected slot → textured blocks with distinct top/side/bottom for grass.
2. `npm run verify:m2` green: all prior checks + new raycast unit/property + place-break e2e + atlas hash check.
3. Review sub-agent sign-off.
4. `/demos/m2-sandbox.md` notes (save format still pre-M5).
5. Retro in `/docs/phase-retros/m2.md`.
