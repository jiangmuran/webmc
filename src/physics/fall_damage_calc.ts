export interface FallInput {
  distanceFallen: number;
  featherFallingLevel: number;
  slowFalling: boolean;
  jumpBoost: number;
  onHay: boolean;
  onSlime: boolean;
  onHoney: boolean;
  inWater: boolean;
}

export function rawFallDamage(distanceFallen: number, jumpBoost: number): number {
  const adjusted = Math.max(0, distanceFallen - 3 - jumpBoost);
  return Math.ceil(adjusted);
}

export function fallDamage(i: FallInput): number {
  if (i.slowFalling || i.inWater) return 0;
  if (i.onSlime) return 0;
  let dmg = rawFallDamage(i.distanceFallen, i.jumpBoost);
  if (i.onHay) dmg = Math.floor(dmg * 0.2);
  if (i.onHoney) dmg = Math.floor(dmg * 0.2);
  const reduction = Math.min(0.8, 0.12 * i.featherFallingLevel);
  return Math.max(0, Math.floor(dmg * (1 - reduction)));
}
