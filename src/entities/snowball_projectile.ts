export interface SnowballHit {
  target: string;
}

export const BLAZE_DAMAGE = 3;
export const REGULAR_DAMAGE = 0;
export const WITHER_DAMAGE = 3;

export function damageOnHit(h: SnowballHit): number {
  if (h.target === 'blaze') return BLAZE_DAMAGE;
  if (h.target === 'wither') return WITHER_DAMAGE;
  return REGULAR_DAMAGE;
}

export function knockbackForce(): number {
  return 0.1;
}
