# Backlog

Items deferred during a milestone that were cut from DONE but should land later. Each entry: origin milestone, one-line description, link to spec or discussion.

## Post-M14

- **Ender dragon boss fight.** `ender_dragon` mob def exists; flight AI, phases (circling / perching / charge), and crystal dependency are unimplemented.
- **End crystals + health-regen rings.** 4 obsidian pillars + crystals restore dragon HP; needs an end-crystal entity with line-of-sight healing.
- **Exit portal + return-to-overworld wiring.** Dimension registry handles travel math; the post-kill exit portal and credits screen are UX layer.
- **End cities + elytra.** Outer-island structures (cross-chunk structure blocker again) with shulkers and an elytra loot slot.
- **Stronghold.** Overworld structure that contains the end portal frame; cross-chunk blocker.
- **Eye of ender tracking behavior.** Item + right-click to throw and point at a stronghold — blocked on stronghold placement.

## Post-M13

- **Dimension swap wiring in main.ts.** DimensionRegistry + portal frame detection + NetherGenerator exist as pure modules; wiring the player travel (stand in portal → fade-to-black → move to translated coords in the other dimension's world) requires save-state plumbing we haven't touched.
- **Nether fortress structure.** Multi-chunk structure (same blocker as M10 mineshafts / villages).
- **Ghast fireball projectile + explosion.** Depends on projectile system from Post-M11 backlog.
- **Blaze fireball (fire-resistance check).** Same.
- **Piglin gold attraction + bartering trades.** Same item-use-on-entity plumbing as breeding/taming.

## Post-M12

- **Enchantment table block + UI.** Registry + apply logic + XP cost logic exist; placing the block, opening an enchant-picker panel, and showing glyph animation are the missing pieces.
- **Brewing stand tile-entity.** Potion recipes + effect registry exist; the stand needs a 20s smelt-style timer + fuel (blaze powder) bookkeeping + inventory slots.
- **Villager entity rendering + trade UI.** Trade logic is pure; spawning a villager Mob with profession state and a DOM trade panel is next.
- **Anvil block + UI.** Combine logic is pure; the anvil block should land blocks + damage drop + a two-slot DOM panel.
- **Enchant-by-bookshelf bonus power.** Currently `rollEnchantment` doesn't weight by bookshelf count; wire once the block is placeable.

## Post-M11

- **Skeleton arrow projectiles.** Current implementation deals instant ranged damage at 8m; real MC fires an arrow entity with ballistic trajectory. Needs a Projectile component + simple kinematic integrator.
- **Pig / cow / sheep / chicken breeding.** Use wheat / seeds / similar → baby mob at half scale + 20 minute growth timer. Needs item-use-on-entity hook.
- **Wolf taming.** Bone item consumes on right-click while neutral → becomes owned; persist owner across world saves.
- **Behavior-tree library.** Current mob AI is a single `tickMob` switch per behavior — fine for 10 kinds; bigger rosters or nested behaviors (flee, pick-up, call-for-help) need a proper BT abstraction.
- **Enderman pick-up block + water damage.** Real ender should grab a random passable block and take damage in water.
- **Spider wall-climb.** Currently fakes with a jump at 4m range; real climbing needs a wall-adherence physics mode.

## Post-M10

- **Abandoned mineshafts (was M10.5).** Multi-chunk planks-and-rails tunnels need a cross-chunk structure system; current generator only places per-chunk. Blocked on structure coordinator.
- **Village v1 (was M10.6).** Flat-ground detection + wood hut templates + path generation. Same cross-chunk blocker as mineshafts.
- **Dungeon spawner entity + chest loot.** Minimal dungeon rooms ship as empty cobble shells; adding a mob-spawner tile-entity and chest with junk loot is next.
- **Ravines (was M10.2).** Second 3D noise pass with elongated-axis warp. Deferred to keep M10 focused on cave shape + ore curves.
- **Cross-chunk cave BFS continuity.** Caves currently cut cleanly at chunk borders since each chunk samples `isCave` independently (the noise IS continuous) but connected-component stitching could prevent isolated dead-ends.

## Post-M9

- **Waterlogged state on fences / slabs / stairs (was M9.6).** Requires per-block variant encoding in `BlockState` props + mesher adjustment.
- **Bucket onUse wiring.** Bucket items are registered; placing water/lava sources or picking them up needs `Interaction.onUse` and InventoryController to swap empty↔filled bucket.
- **Water-meets-lava conversion.** Adjacent sources: water + flowing lava → cobblestone; water + source lava → obsidian; flowing water + lava → stone (MC rules).
- **Flowing-lava dynamic light propagation.** Registry lightEmission 15 only fires on block state; flowing levels should taper light or BFS-propagate.
- **Fire spread from lava.** Placeholder for M9 scope that was never taken; behaviour lives with the combustion system (future M).

## Post-M8

- **Placement + interaction wiring (was M8.6).** Place dust/torch/lever/button/plate/door via Interaction.onPlace; add Interaction.onUse for lever toggle, button press, door manual open.
- **`m8-door.webmc` demo save (was M8.7).** Blocked on placement + on `.webmc` zip export (Post-M5).
- **Torch inverter + quasi-connectivity.** Torches emit conditionally on mount-block power; fixed-point iteration.
- **3D rendering for dust / torch / door.** Real geometries instead of generic coloured cubes.

## Post-M7

- **Crafting grid UI (was M7.3).** RecipeRegistry resolver exists; a 2×2 / 3×3 DOM grid with drag-drop (or tap-to-slot on touch) is the missing integration piece.
- **Furnace (was M7.4).** Tile-entity state + smelting recipe registry + fuel bookkeeping.
- **Tool durability + tier gating at interaction (was M7.5 full).** InteractionController should read the hotbar-selected tool's toolKind/toolTier and pass them into BlockDropRegistry.drops().
- **Inventory consumption on block placement.** Currently creative-style (infinite). Swap to consume-from-selected-hotbar-slot when the crafting UI lands.
- **Pathfinder wired into mob AI.** findPath is tested; Mob.tickMob should use it with a 0.5s re-path throttle.
- **Save/restore PlayerState across reload.** Persistence schema already has the slot; 1-line wire-up.

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
