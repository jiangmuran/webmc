export interface LandCtx {
  block: string;
  fallDistance: number;
  sneaking: boolean;
}

export const SLIME_BOUNCE_MULT = 0.8;

export function bounceVelocity(c: LandCtx): number {
  if (c.sneaking) return 0;
  if (c.block === 'slime_block') return c.fallDistance * SLIME_BOUNCE_MULT;
  if (c.block === 'honey_block') return 0;
  return 0;
}

export function honeySlowMultiplier(block: string): number {
  return block === 'honey_block' ? 0.4 : 1;
}

export function negatesFallDamage(block: string): boolean {
  return block === 'slime_block' || block === 'honey_block';
}
