# Backlog

Items deferred during a milestone that were cut from DONE but should land later. Each entry: origin milestone, one-line description, link to spec or discussion.

## Post-M2

- **Procedural atlas generator (was M2.4)** — deterministic noise+palette 16×16 tiles, 512×512 atlas PNG + JSON UV map. Ships alongside M3 biome tinting so biome colors are applied to real textures, not flat colors. Design: `/docs/specs/m2-block-interaction.md` §Atlas.
- **UV vertex attribute (was M2.5-full)** — `Float32Array uvs` appended to MeshOutput; mesher emits per-face UVs from atlas map; shader samples texture. Blocked on the atlas above.

## Post-M1

- **Binary bit-mask greedy meshing (cgerikj)** — classical greedy ships 10× under budget; upgrade only if later content milestones spike mesh time.
- **Worker pool > 1** — current `MesherClient` uses a single worker. Desktop can run 4–8 in parallel.
- **Swept AABB collision** — per-axis is fine at ≤ 0.25 m/frame speeds; upgrade when fast mobs land in M7+ so projectiles and sprinters don't tunnel through 1-voxel walls.
- **WebGL2 explicit-assert fallback** — our boot throws on WebGL1. Consider a "your GPU is too old" HTML overlay instead of a raw Error.
