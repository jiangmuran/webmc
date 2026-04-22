// Swift Sneak (ancient city loot). Sneak speed is normally capped at 30%
// of walk speed; each level adds 15% (up to +45% at level 3).

export interface SwiftSneakQuery {
  sneaking: boolean;
  swiftSneakLevel: number;
}

const BASE_SNEAK_FRACTION = 0.3;

export function sneakSpeedFraction(q: SwiftSneakQuery): number {
  if (!q.sneaking) return 1;
  const l = Math.max(0, Math.min(3, q.swiftSneakLevel));
  return Math.min(1, BASE_SNEAK_FRACTION + l * 0.15);
}

export function sneakSpeed(baseSpeed: number, q: SwiftSneakQuery): number {
  return baseSpeed * sneakSpeedFraction(q);
}
