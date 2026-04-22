# M13 — Nether (Design Note)

**Master Plan reference:** M13 — `~25h`. DONE-when = nether portal swaps dimension; nether terrain; nether mobs (ghast / blaze / piglin / wither skeleton).

Wiki refs: `The_Nether.wikitext`, `Ghast.wikitext`, `Blaze.wikitext`, `Piglin.wikitext`, `Wither_Skeleton.wikitext`.

## Sub-tasks

```
M13.1  Nether block defs (netherrack, soul_sand, nether_brick,
       nether_quartz, glowstone already, magma)               [1h]  ✓
M13.2  NetherGenerator — 3D noise + lava sea + netherrack      [3h]  ✓
M13.3  Portal detection (4-high 2-wide obsidian frame)        [2h]  ✓
M13.4  Dimension type + worlds-per-dimension registry         [2h]  ✓
M13.5  Nether mob defs: ghast, blaze, piglin, wither skeleton [2h]  ✓
M13.6  Unit tests                                             [2h]  ✓
M13.7  verify:m13 + retro + close                             [1h]  ✓
```

## DONE

1. `npm run verify:m13` green.
2. Generator produces netherrack floor, lava oceans at y=32, ceiling of netherrack at y=128.
3. Portal frame detection returns the inner fill rectangle when a valid 2×3 obsidian ring is placed.
4. Nether mob defs integrated with MobWorld behavior enum.
5. Retro.
