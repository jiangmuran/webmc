// Explosion power & damage falloff. Rays are cast from the center
// through neighbors; blocks with blast resistance absorb power.

export interface ExplosionCtx {
  centerX: number;
  centerY: number;
  centerZ: number;
  power: number; // creeper = 3, TNT = 4, charged creeper = 6
}

export function damageToEntity(
  e: ExplosionCtx,
  ex: number,
  ey: number,
  ez: number,
  exposure: number,
): number {
  const dx = ex - e.centerX;
  const dy = ey - e.centerY;
  const dz = ez - e.centerZ;
  const dist = Math.hypot(dx, dy, dz);
  const maxDist = e.power * 2;
  if (dist >= maxDist) return 0;
  const impact = (1 - dist / maxDist) * exposure;
  return Math.floor(((impact * impact + impact) / 2) * 7 * e.power + 1);
}

export function blastResistanceAbsorb(
  startPower: number,
  blockResistance: number,
  stepDistance: number,
): number {
  return startPower - (blockResistance + 0.3) * 0.3 * stepDistance;
}

export function breaksBlocks(e: ExplosionCtx): boolean {
  return e.power > 0;
}
