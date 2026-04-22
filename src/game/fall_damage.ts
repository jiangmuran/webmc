// Fall damage. 3-block safety buffer + feather-falling reduction + jump-
// boost allowance + slow-falling immunity. Matches MC formula:
//   damage = max(0, floor(fallDistance - 3) - jumpBoostLevel)
// Slow falling + levitation cancel all fall damage. Feather falling
// reduces by 12% per level up to 4.

export interface FallDamageQuery {
  fallDistance: number;
  featherFallingLevel: number;
  jumpBoostLevel: number;
  slowFalling: boolean;
  inWater: boolean;
  onHayBale: boolean;
  onSlime: boolean;
}

export function computeFallDamage(q: FallDamageQuery): number {
  if (q.slowFalling) return 0;
  if (q.inWater) return 0;
  if (q.onSlime) return 0;

  const raw = Math.max(0, Math.floor(q.fallDistance) - 3 - q.jumpBoostLevel);
  if (raw <= 0) return 0;

  let dmg = raw;
  if (q.onHayBale) dmg *= 0.2;
  if (q.featherFallingLevel > 0) {
    const l = Math.min(4, q.featherFallingLevel);
    dmg *= 1 - 0.12 * l;
  }
  return Math.max(0, dmg);
}

// A "safe fall height" calculator: how many blocks can a player fall
// before taking ≥1 damage?
export function safeFallHeight(q: Omit<FallDamageQuery, 'fallDistance'>): number {
  if (q.slowFalling || q.inWater || q.onSlime) return Infinity;
  return 3 + q.jumpBoostLevel;
}

// Fall-distance-to-damage reverse: used to preview on HUD the falling
// heart icons.
export function fallDamageHearts(q: FallDamageQuery): number {
  return computeFallDamage(q) / 2; // hearts = damage / 2 (1HP per half-heart)
}
