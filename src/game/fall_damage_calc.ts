// Fall damage calculation. 1 HP per block fallen beyond 3. Feather
// Falling, Slow Falling, water-landing reduce.

export function baseFallDamage(fallDistance: number): number {
  return Math.max(0, Math.floor(fallDistance) - 3);
}

export interface FallMods {
  hayBale: boolean;
  water: boolean;
  slowFalling: boolean;
  featherFallingLevel: number;
  jumpBoostLevel: number;
  boots: boolean;
}

export function adjustedFallDamage(fallDistance: number, m: FallMods): number {
  if (m.water) return 0;
  if (m.slowFalling) return 0;
  let d = fallDistance;
  // Jump boost raises "virtual" start.
  d -= m.jumpBoostLevel;
  let raw = baseFallDamage(d);
  if (m.hayBale) raw *= 0.2;
  const featherReduction = 1 - Math.min(1, m.featherFallingLevel * 0.12);
  return Math.max(0, raw * featherReduction);
}
