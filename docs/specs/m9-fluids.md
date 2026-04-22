# M9 — Fluids (Design Note)

**Master Plan reference:** M9 — `~15h`. DONE-when = water + lava flow; waterlogged blocks stay wet; swim physics + lava damage.

Wiki refs (cached): `Water.wikitext`, `Lava.wikitext`, `Waterlogging.wikitext`, `Fluid.wikitext`.

## Sub-tasks

```
M9.1  FluidField simulator: level 0-7 + source flag         [2h]  pure fn
M9.2  Water/lava block defs + bucket items                  [1h]
M9.3  Adapter over World.get to FluidField                  [1h]
M9.4  Swim physics (buoyancy + drag) in FirstPersonCamera   [2h]
M9.5  Lava damage tick in PlayerState                       [1h]
M9.6  Waterlogged state on fence/slab/stairs (deferred)     [--]
M9.7  Tests: unit (sim) + integration (swim)                [2h]
M9.8  verify:m9 + retro + close                             [1h]
```

## Signal model

Each fluid cell holds:

- `level`: 0 (dry) through 8 (source). MC uses 0-7 + "source" bit; we flatten to 8 = source, 1-7 = flowing, 0 = empty.
- `kind`: 'water' | 'lava' | null.

Propagation per tick:

- A source cell with an empty/dry neighbor spreads at level 7.
- A flowing cell at level N spreads to horizontal neighbors at level N-1 (N ≥ 2) or level N-2 for lava.
- Fluid flows down unconditionally: a cell above a non-solid non-fluid cell spreads at full level downward.
- Two sources adjacent → water produces flowing stone (MC cobblestone rule) — deferred to M10 (ore gen).
- Fluid + fluid of different kind → stone + obsidian (deferred).

## DONE

1. `npm run verify:m9` green.
2. Swim works (jump doesn't apply same gravity while submerged; player rises slowly while input.jump=true in water).
3. Lava slot in hotbar, place + nearby player HP tick down.
4. Retro.
