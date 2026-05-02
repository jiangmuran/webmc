// Brush item (1.20 archaeology). Used on suspicious_sand or suspicious_gravel
// blocks; 4 ticks of brushing reveal the hidden loot and turn the block to
// its base variant (sand / gravel).

export type SuspiciousKind = 'suspicious_sand' | 'suspicious_gravel';

export interface BrushState {
  ticksBrushed: number;
  done: boolean;
}

export function makeBrushState(): BrushState {
  return { ticksBrushed: 0, done: false };
}

// Wiki (minecraft.wiki/w/Brush): "It takes 96 game ticks (4.8
// seconds) to brush a single suspicious block." Old comment claimed
// "~10 ticks (0.5s)" — wrong reference value; old constant 4 was
// 24× too fast. Sibling brush_dig.ts uses 96.
const TICKS_TO_REVEAL = 96;

export interface BrushStep {
  revealed: boolean;
  baseBlock: 'webmc:sand' | 'webmc:gravel' | null;
}

export function brushOnce(state: BrushState, kind: SuspiciousKind): BrushStep {
  if (state.done) return { revealed: false, baseBlock: null };
  state.ticksBrushed++;
  if (state.ticksBrushed >= TICKS_TO_REVEAL) {
    state.done = true;
    return {
      revealed: true,
      baseBlock: kind === 'suspicious_sand' ? 'webmc:sand' : 'webmc:gravel',
    };
  }
  return { revealed: false, baseBlock: null };
}

// Loot pools for suspicious blocks — picks a single result deterministically
// from the pool using `roll in [0,1)`.
export interface BrushLootEntry {
  item: string;
  weight: number;
}

export type BrushLootPool =
  | 'desert_well'
  | 'desert_pyramid'
  | 'trail_ruins_common'
  | 'trail_ruins_rare'
  | 'ocean_ruin_warm'
  | 'ocean_ruin_cold';

const POOLS: Record<BrushLootPool, readonly BrushLootEntry[]> = {
  desert_well: [
    { item: 'webmc:brick_pottery_sherd', weight: 1 },
    { item: 'webmc:arms_up_pottery_sherd', weight: 1 },
    { item: 'webmc:emerald', weight: 2 },
    { item: 'webmc:stick', weight: 4 },
  ],
  desert_pyramid: [
    { item: 'webmc:archer_pottery_sherd', weight: 1 },
    { item: 'webmc:miner_pottery_sherd', weight: 1 },
    { item: 'webmc:emerald', weight: 3 },
    { item: 'webmc:diamond', weight: 1 },
  ],
  trail_ruins_common: [
    { item: 'webmc:wheat', weight: 4 },
    { item: 'webmc:coal', weight: 4 },
    { item: 'webmc:iron_nugget', weight: 3 },
    { item: 'webmc:emerald', weight: 2 },
  ],
  trail_ruins_rare: [
    { item: 'webmc:flow_armor_trim', weight: 1 },
    { item: 'webmc:bolt_armor_trim', weight: 1 },
    { item: 'webmc:music_disc_relic', weight: 1 },
  ],
  ocean_ruin_warm: [
    { item: 'webmc:angler_pottery_sherd', weight: 1 },
    { item: 'webmc:shelter_pottery_sherd', weight: 1 },
    { item: 'webmc:emerald', weight: 2 },
  ],
  ocean_ruin_cold: [
    { item: 'webmc:snort_pottery_sherd', weight: 1 },
    { item: 'webmc:prize_pottery_sherd', weight: 1 },
    { item: 'webmc:emerald', weight: 2 },
  ],
};

export function rollBrushLoot(pool: BrushLootPool, roll: number): string {
  const entries = POOLS[pool];
  const total = entries.reduce((s, e) => s + e.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const e of entries) {
    acc += e.weight;
    if (target < acc) return e.item;
  }
  return entries[entries.length - 1]?.item ?? 'webmc:air';
}
