export type AnvilStage = 'anvil' | 'chipped_anvil' | 'damaged_anvil';

const CHAIN: AnvilStage[] = ['anvil', 'chipped_anvil', 'damaged_anvil'];

export function nextDamage(current: AnvilStage): AnvilStage | undefined {
  const i = CHAIN.indexOf(current);
  if (i < 0 || i === CHAIN.length - 1) return undefined;
  return CHAIN[i + 1];
}

export const USE_DAMAGE_CHANCE = 0.12;

export function onUse(current: AnvilStage, rng: () => number): AnvilStage | undefined {
  if (rng() < USE_DAMAGE_CHANCE) return nextDamage(current);
  return current;
}

export function isBroken(current: AnvilStage | undefined): boolean {
  return current === undefined;
}
