# M8 — Redstone Fundamentals (Design Note)

**Master Plan reference:** M8 — `~20h`. DONE-when = load shipped demo, press button, door opens; break dust, propagation visibly breaks.

Wiki refs (cached): `Redstone_Dust.wikitext`, `Redstone_Torch.wikitext`, `Redstone_circuits.wikitext`, `Lever.wikitext`, `Button.wikitext`, `Pressure_plate.wikitext`, `Door.wikitext`, `Tick.wikitext`.

Clean-room: all numbers and behaviours sourced from the wiki above. No reads into `/mc-ref/`.

## Sub-tasks

```
M8.1  Signal model + PowerGrid (flood-fill BFS)         [2h]  pure fn
M8.2  Dust, torch, lever, button, plate block types     [2h]  registry entries
M8.3  Power source list + propagation tick              [2h]
M8.4  Door block (powered → open) + trapdoor            [1.5h]
M8.5  10 Hz tick scheduler w/ queued updates            [1.5h]
M8.6  Sign-posts into main.ts + HUD counter             [1h]
M8.7  Demo save: 3x3 button-activated door              [1.5h]
M8.8  Tests: unit (simulator) + e2e (demo load)         [2h]
M8.9  verify:m8 + retro + close                         [1h]
```

Honest ~15 h.

## Signal model

```ts
type PowerLevel = 0 | 1 | 2 | ... | 15;

interface RedstoneBlockDef {
  kind: 'none' | 'dust' | 'torch' | 'lever' | 'button' | 'pressure_plate' | 'door' | 'conductor' | 'opaque';
  // dust: receives+transmits
  // torch: emits 15 (inverter if mounted on powered conductor)
  // lever: toggle source
  // button: momentary (20 tick = 1s)
  // pressure_plate: on while entity on top
  // door: accepts power → open state bit
  // conductor: opaque block; can be "strong-powered" by adjacent torch/source
}
```

Signal propagation per MC wiki:

- Active dust emits its power level to the 4 neighbors and the block beneath it.
- Dust loses 1 per block travelled.
- Torch on conductor: emits 15 upward + 4 sides when its mounting block is unpowered; emits 0 when mounting is powered.
- Lever on conductor: emits 15 to all sides when on.
- Button: 15 for 20 ticks after press.
- Pressure plate: 15 while entity AABB overlaps.
- Doors: open when any face receives ≥ 1.

## Simulator

`computePower(world, sources)` runs once per redstone tick:

1. Start with a map `power: Record<blockKey, PowerLevel>` set to 0.
2. For each source (lever, button, torch, plate, ore): seed neighbors with their emission.
3. BFS dust: pop the max-power frontier cell; push neighbor dust with `power-1` if higher than current value.
4. Mark "strongly powered" conductors (those adjacent to a source or torch pointing into them).
5. Apply: toggle door block states; update torch states (on-when-mounting-unpowered).

Repeat until stable (max 32 iterations; flag if not stable).

## Tick scheduler

`RedstoneTicker.tick(dt)` accumulates elapsed and fires `computePower` when ≥ 100 ms (10 Hz). Button press calls `ticker.scheduleEvent(pos, 'button-release', 1000ms)`.

## DONE

1. `npm run dev` → load demo save → press button → door opens; release → door closes.
2. `npm run verify:m8` green; unit tests cover straight-line dust attenuation, torch inverter, button momentary, lever toggle.
3. Retro + demo notes.
