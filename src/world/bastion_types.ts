// Bastion remnant types with loot pools.

export type BastionKind = 'hoglin_stable' | 'housing_units' | 'treasure' | 'bridge';

export const BASTION_WEIGHTS: Record<BastionKind, number> = {
  hoglin_stable: 25,
  housing_units: 30,
  treasure: 20,
  bridge: 25,
};

export function pickBastion(rand: () => number): BastionKind {
  const total = Object.values(BASTION_WEIGHTS).reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (const [k, w] of Object.entries(BASTION_WEIGHTS) as [BastionKind, number][]) {
    if (r < w) return k;
    r -= w;
  }
  return 'hoglin_stable';
}

export function guaranteedLoot(kind: BastionKind): string[] {
  if (kind === 'treasure') return ['netherite_ingot', 'gilded_blackstone', 'ancient_debris'];
  if (kind === 'hoglin_stable') return ['saddle', 'crying_obsidian'];
  if (kind === 'housing_units') return ['gold_block', 'magma_cream'];
  return ['gold_ingot', 'nether_quartz'];
}

export function piglinGuardCount(kind: BastionKind): number {
  if (kind === 'housing_units') return 6;
  if (kind === 'treasure') return 4;
  return 3;
}
