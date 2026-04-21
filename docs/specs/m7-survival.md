# M7 — Survival Core (Design Note)

**Master Plan reference:** M7 — `~30h`. DONE-when = first-night-survival loop demoable (wood → pickaxe → stone → shelter → survive zombies).

Read: `AGENT_CHARTER.md` + `docs/STANDARDS.md` + `docs/phase-retros/m6.md`. Wiki refs (cached): `Inventory.wikitext`, `Crafting.wikitext`, `Furnace.wikitext`, `Smelting.wikitext`, `Zombie.wikitext`, `Pig.wikitext`, `Pickaxe.wikitext`, `Sword.wikitext`, `Health.wikitext`, `Hunger.wikitext`, `Food.wikitext`, `Damage.wikitext`, `Mob_spawning.wikitext`.

Clean-room: all mechanics derived from the wiki pages above. No reads into `/mc-ref/` or `/some-information/`.

## Sub-tasks

```
M7.1  Item + ItemStack + Inventory core (27+9+4 slots)   [3h]  pure fn
M7.2  Recipe registry + 2×2/3×3 resolver                 [3h]  pure fn
M7.3  Hotbar + inventory DOM UI (drag-drop)              [3h]
M7.4  Furnace smelting (fuel, progress, output slot)     [2h]
M7.5  Tool/weapon durability + tier progression          [2h]
M7.6  ECS for mobs (components + systems)                [3h]
M7.7  Pig + Zombie + Skeleton mobs with FSM AI           [4h]
M7.8  Voxel A* pathfinding (bounded-budget)              [3h]
M7.9  Mob spawning (skyLight threshold, biome-aware)     [2h]
M7.10 Health + hunger + damage + respawn                 [2h]
M7.11 Playwright first-night e2e scenario                [1.5h]
M7.12 verify:m7 + retro + close                          [1.5h]
```

Honest ~30 h.

## Data shapes

```ts
// Items are registry-defined; an ItemStack is (itemId, count, meta).
interface ItemDef {
  name: string;
  maxStack: number; // 64 for blocks/food, 1 for tools
  durability: number; // 0 = non-tool
  blockId?: BlockId; // when present, item is placeable as a block
}

interface ItemStack {
  itemId: ItemId;
  count: number;
  damage: number;
}

class Inventory {
  hotbar: (ItemStack | null)[]; // length 9
  main: (ItemStack | null)[]; // length 27
  armor: (ItemStack | null)[]; // length 4 (helmet, chest, legs, boots)
  offhand: ItemStack | null;
  selectedHotbar: number; // 0..8
}

// Recipe types:
interface ShapedRecipe {
  pattern: (ItemId | null)[][];
  result: ItemStack;
}
interface ShapelessRecipe {
  ingredients: ItemId[];
  result: ItemStack;
}
```

## Crafting resolver

Takes a grid of `(ItemStack | null)` of dimension 2×2 or 3×3; iterates registered recipes:

- **Shaped**: try the pattern at every top-left offset where it fits. Allow horizontal mirror. Blank cells in the grid must match blank cells in the pattern.
- **Shapeless**: bag-equality of the non-null grid cells against the recipe's ingredients list (multiset).

Returns the first matching result. Ambiguity is resolved by registration order for now.

## Mob ECS

Components:

- `Transform` — position, yaw, velocity
- `Health`, `Hunger` (player only)
- `MobKind` — enum Pig, Zombie, Skeleton
- `AIState` — FSM state + target + path
- `Renderable` — pointer to Three mesh

Systems run each tick:

- `AISystem` — updates FSM state, dispatches pathfinding when target changes
- `PathfindingSystem` — runs A\* on walkable voxels with a per-tick budget
- `PhysicsSystem` — gravity + collision (reuse `sweepMove`)
- `DamageSystem` — applies pending damage events, fires respawn if Health ≤ 0
- `SpawnSystem` — walks candidate blocks in loaded chunks at night, spawns mobs in dark

## Pathfinding

Voxel A\* with step/jump costs:

- horizontal step: 1.0
- up 1 (if headroom): 1.5
- down 1: 0.5
- down 2+: cost + fall damage lookahead

Budget: 2000 node expansions per path; if exhausted, fall back to "step toward target if walkable else jump" (charmingly dumb mob).

## Health + Hunger

- Health: 20 half-hearts (0–20 integer). Hurt → HP -= dmg. 0 → respawn at worldMeta.spawn.
- Hunger: 20 shanks. Depletes on sprint + at 2 shanks/min baseline. At 0, HP decreases slowly.
- Food ItemStack has `hungerRestore` + `saturation` fields.

## Multiplayer caveats

M6 only syncs block edits + chat. Mob state, player health, and inventory are host-authoritative in theory but not wired yet. For M7 single-player is the primary target; multiplayer-aware mob sync is an M7-follow-up alongside the M6.6 (chunk streaming) backlog item.

## DONE (per STANDARDS.md §2.1)

1. Spawn into world at dawn → chop wood → craft planks → craft stone pickaxe (via wood → sticks + stone) → mine stone → shelter → night falls → zombie spawns in a dark cave → zombie paths to player → damage dealt → player takes damage, health drops, respawns if killed.
2. `npm run verify:m7` green.
3. Review sub-agent sign-off.
4. `/demos/m7-first-night.md`.
5. Retro.
