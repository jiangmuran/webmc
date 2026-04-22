# demo: m7-first-night

M7 introduces the first playable survival loop: break blocks for drops, fill your inventory, watch zombies spawn at night and path toward you.

## Reproduce

```
npm run dev
# http://localhost:5173
```

Click the canvas for pointer lock. Break a few blocks — they add to your inventory (visible in the HUD top line as `items N/9`). Wait for the 10-minute day/night cycle to rotate into dusk; hostile mobs (green = zombie, gray = skeleton) start spawning in the 5-24 m ring around you, up to 4 concurrent. Pink cubes are pigs and spawn during the day. The HUD's `HP` and `food` counters tick down when hostile mobs reach you.

## Expected metrics

- 236 unit tests + 18 Playwright scenarios green via `npm run verify:m7`.
- Mob placeholders render as coloured AABB boxes — art arrives in M11.
- Zombies visibly change direction and pursue the player when within 16 m; passive mobs idle.
- Breaking stone with a bare hand still drops an item (tool tier gating lives in BlockDropRegistry but the InteractionController doesn't pass tool info yet — that's M7.5 in the backlog).

## Deferred (see backlog.md Post-M7)

- Crafting grid UI (recipe resolver is pure fn, UI is glue).
- Furnace smelting + fuel.
- Tool durability + tool-tier-gated drops in Interaction.
- Inventory consumption on block placement.
- A\* pathfinder wired into mob AI (currently line-of-sight chase).
