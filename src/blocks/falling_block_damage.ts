// Falling block damages entities it lands on (anvils scale).

export interface FallCtx {
  blockId: string;
  fallDistance: number;
}

export const DAMAGE_PER_BLOCK: Record<string, number> = {
  anvil: 2,
  chipped_anvil: 2,
  damaged_anvil: 2,
  pointed_dripstone: 2,
  sand: 0,
  gravel: 0,
};

export const MAX_FALL_DAMAGE = 40;

export function damageOnHit(c: FallCtx): number {
  const perBlock = DAMAGE_PER_BLOCK[c.blockId] ?? 0;
  if (perBlock === 0) return 0;
  return Math.min(MAX_FALL_DAMAGE, Math.max(0, Math.floor(c.fallDistance - 1)) * perBlock);
}

export function anvilDamageChance(c: FallCtx): number {
  if (c.blockId !== 'anvil' && c.blockId !== 'chipped_anvil') return 0;
  return Math.min(1, c.fallDistance * 0.05);
}

export function degradesAnvil(c: FallCtx, rand: () => number): string | null {
  if (rand() >= anvilDamageChance(c)) return null;
  if (c.blockId === 'anvil') return 'chipped_anvil';
  if (c.blockId === 'chipped_anvil') return 'damaged_anvil';
  if (c.blockId === 'damaged_anvil') return null; // destroyed
  return null;
}
