// Heavy core. Rare drop from ominous vaults; one-shot ingredient in the
// mace recipe (heavy_core + breeze_rod = mace). Stacks to 1.

export const HEAVY_CORE_MAX_STACK = 1;

export interface HeavyCoreStack {
  count: number;
}

export function makeHeavyCore(): HeavyCoreStack {
  return { count: 1 };
}

export type HeavyCoreSource = 'ominous_vault' | 'command';

export interface HeavyCoreDropQuery {
  source: HeavyCoreSource;
  roll: number;
}

// Ominous vaults drop heavy core with ~0.05 chance per unlock.
const DROP_CHANCES: Record<HeavyCoreSource, number> = {
  ominous_vault: 0.05,
  command: 1,
};

export function tryDropHeavyCore(q: HeavyCoreDropQuery): HeavyCoreStack | null {
  const chance = DROP_CHANCES[q.source];
  if (q.roll >= chance) return null;
  return makeHeavyCore();
}

// Mace crafting: 1 heavy core above 1 breeze rod in a vertical column.
export interface MaceCraftQuery {
  heavyCore: number;
  breezeRod: number;
}

export function consumeForMaceCraft(q: MaceCraftQuery): boolean {
  return q.heavyCore >= 1 && q.breezeRod >= 1;
}
