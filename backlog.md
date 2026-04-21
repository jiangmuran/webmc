# Backlog

Items deferred during a milestone that were cut from DONE but should land later. Each entry: origin milestone, one-line description, link to spec or discussion.

## Post-M6

- **Chunk streaming on join (was M6.6).** CHUNK_FULL / CHUNK_DELTA messages so a freshly-joined guest inherits the host's edited chunks.
- **Client prediction + reconciliation (was M6.5).** For remote-player motion once avatars exist.
- **Remote-player avatars + chat UI (was M6.7/8).** Capsule mesh + nametag; in-world chat bubble.
- **Host-migration.** Elect new host + hand over world state on drop.
- **Client-side rate limiting + per-message-type validation.** Server rate-limits; client should too for hostile-peer hardening.

## Post-M5

- **Zstd compression (was M5.3).** zstd-via-wasm on ChunkBlob.payload. ~3x shrink, 50 KB dep.
- **World selector UI (was M5.5).** DOM modal: list / create (name + seed) / load / delete / rename. DAL pieces already exist.
- **.webmc zip export/import (was M5.6).** `client-zip` writer + `fflate` reader + world.json + player.json + chunks/\*.bin.
- **Schema migrations scaffold (was M5.7).** `persist/migrations/vN_to_vN+1.ts` files, run on upgradeneeded + on import. Needed when schemaVersion bumps.
- **Quota / OPFS fallback.** `navigator.storage.estimate` check + toast + LRU eviction of distant chunks.

## Post-M4

- **Settings panel (was M4.4).** DOM sliders for FOV, view distance, sensitivity, master volume; persist to `localStorage['webmc.settings.v1']`. Also shown from ⚙️ button and `Esc` keypress.
- **Dynamic-quality throttle (was M4.3).** Rolling p95 frame time; drop view distance by 1 on sustained > 33 ms, restore on < 22 ms sustained.
- **Footstep cadence.** `SOUNDS.step` exists but unhooked. Add a step timer in `FirstPersonCamera.update` that fires when `onGround && moving` at ~2.5 Hz.
- **Mobile FPS floor e2e.** Dedicated 5-second FPS-floor scenario asserting ≥ 20 on Pixel-7 emulation.

## Post-M3

- **Vertex AO** — sample 3 neighbor solids per quad corner, multiply into vertex shade. Needs a second Uint8Array attribute since `colors.a` now carries voxel light. Corner hardening is the visual win.
- **Cross-chunk light BFS** — block and sky light currently stop at chunk borders. Horizontal bleed under overhangs requires propagating BFS queues into neighbor chunks and re-meshing them. Queue management + re-mesh trigger is the work.
- **Biome-colored grass/leaves tint** — per-biome RGB tint sent as a vertex attribute or fragment uniform keyed by world XZ.
- **WorldGenerator in a worker** — sync on main thread is fine at 6-chunk radius; mobile at 12 will need the migration.

## Post-M2

- **Procedural atlas generator (was M2.4)** — deterministic noise+palette 16×16 tiles, 512×512 atlas PNG + JSON UV map. Ships alongside M3 biome tinting so biome colors are applied to real textures, not flat colors. Design: `/docs/specs/m2-block-interaction.md` §Atlas.
- **UV vertex attribute (was M2.5-full)** — `Float32Array uvs` appended to MeshOutput; mesher emits per-face UVs from atlas map; shader samples texture. Blocked on the atlas above.

## Post-M1

- **Binary bit-mask greedy meshing (cgerikj)** — classical greedy ships 10× under budget; upgrade only if later content milestones spike mesh time.
- **Worker pool > 1** — current `MesherClient` uses a single worker. Desktop can run 4–8 in parallel.
- **Swept AABB collision** — per-axis is fine at ≤ 0.25 m/frame speeds; upgrade when fast mobs land in M7+ so projectiles and sprinters don't tunnel through 1-voxel walls.
- **WebGL2 explicit-assert fallback** — our boot throws on WebGL1. Consider a "your GPU is too old" HTML overlay instead of a raw Error.
