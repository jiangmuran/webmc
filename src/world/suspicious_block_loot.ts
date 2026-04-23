// Suspicious sand/gravel loot tables by structure context.

export type SuspiciousContext =
  | 'desert_pyramid'
  | 'desert_well'
  | 'ocean_ruin_warm'
  | 'ocean_ruin_cold'
  | 'trail_ruins_common'
  | 'trail_ruins_rare';

export interface Entry {
  item: string;
  weight: number;
}

const POOLS: Record<SuspiciousContext, Entry[]> = {
  desert_pyramid: [
    { item: 'pottery_sherd_archer', weight: 1 },
    { item: 'pottery_sherd_prize', weight: 1 },
    { item: 'emerald', weight: 3 },
    { item: 'diamond', weight: 1 },
    { item: 'gunpowder', weight: 5 },
  ],
  desert_well: [
    { item: 'suspicious_stew', weight: 2 },
    { item: 'brick', weight: 3 },
    { item: 'emerald', weight: 1 },
  ],
  ocean_ruin_warm: [
    { item: 'pottery_sherd_snort', weight: 1 },
    { item: 'cod', weight: 3 },
    { item: 'iron_ingot', weight: 1 },
  ],
  ocean_ruin_cold: [
    { item: 'pottery_sherd_shelter', weight: 1 },
    { item: 'salmon', weight: 3 },
    { item: 'iron_ingot', weight: 1 },
  ],
  trail_ruins_common: [
    { item: 'coal', weight: 5 },
    { item: 'wheat', weight: 3 },
    { item: 'iron_nugget', weight: 2 },
  ],
  trail_ruins_rare: [
    { item: 'trial_key', weight: 1 },
    { item: 'pottery_sherd_wayfinder', weight: 2 },
  ],
};

export function rollSuspicious(ctx: SuspiciousContext, rand: () => number): string {
  const pool = POOLS[ctx];
  const total = pool.reduce((s, e) => s + e.weight, 0);
  let r = rand() * total;
  for (const e of pool) {
    if (r < e.weight) return e.item;
    r -= e.weight;
  }
  return pool[0]?.item ?? 'brick';
}
