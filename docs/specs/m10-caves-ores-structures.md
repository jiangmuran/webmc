# M10 — Caves, Ores, Structures (Design Note)

**Master Plan reference:** M10 — `~25h`. DONE-when = 3D noise caves visible underground; ore distribution matches MC curves; dungeons / mineshafts / villages placed deterministically by seed.

Wiki refs (cached): `Cave.wikitext`, `Ore.wikitext`, `Dungeon.wikitext`, `Mineshaft.wikitext`, `Village.wikitext`.

## Sub-tasks

```
M10.1  3D noise cave carve pass in WorldGenerator              [3h]
M10.2  Ravines (second 3D pass)                                [2h]
M10.3  Ore distribution: coal, iron, gold, diamond, redstone,
       lapis, emerald with per-ore Y-band spawn curves          [3h]
M10.4  Deterministic dungeon rooms (spawner + chests) placed by
       chunk-local RNG                                          [3h]
M10.5  Abandoned mineshaft spans (planks + rails, no carts)     [3h]
M10.6  Village v1: flat-ground detection, wood huts + path      [4h]
M10.7  Tests: unit (noise determinism, ore curves) + e2e cave
       visibility                                              [2h]
M10.8  verify:m10 + retro + close                               [1h]
```

## Signals

- **Cave carve** — 3D Perlin `fbm3(x, y, z)` at frequency 1/24; threshold 0.3 carves air. Strip deepslate transition at y<0.
- **Ore density** — per-ore triangular Y distribution (matching MC): coal ~y 0–255 peak 95, iron peak 15, gold peak -17, diamond peak -58, redstone peak -58, lapis peak 0, emerald peak 100.
- **Structures** — deterministic by `hash32(cx, cz, seed ^ STRUCTURE_SALT)`; per-chunk probability: dungeon 1/30, mineshaft spine 1/60, village core 1/250 with flat-ground retry.

## DONE

1. `npm run verify:m10` green.
2. Fly underground; caves are connected networks (not isolated pockets).
3. Mine at y=-50; see diamond ore distribution consistent with MC.
4. Seed-reproducibility: identical seed produces identical caves + ore placements across runs.
5. Retro.
