export interface ExplosionInput {
  radius: number;
  distance: number;
  blastProtection: number;
  shielded: boolean;
}

export function rawDamage(i: ExplosionInput): number {
  if (i.distance >= i.radius) return 0;
  const f = 1 - i.distance / i.radius;
  return Math.floor((f * f * 7 + f) * i.radius);
}

export function reducedByProtection(damage: number, blastProt: number): number {
  const reduction = Math.min(0.8, blastProt * 0.08);
  return damage * (1 - reduction);
}

export function appliedDamage(i: ExplosionInput): number {
  let d = rawDamage(i);
  d = reducedByProtection(d, i.blastProtection);
  if (i.shielded) d *= 0.5;
  return Math.max(0, Math.floor(d));
}

export function blockBreakProbability(blockResistance: number, explosionPower: number): number {
  if (explosionPower <= 0) return 0;
  const ratio = (explosionPower - blockResistance) / explosionPower;
  return Math.max(0, Math.min(1, ratio));
}
