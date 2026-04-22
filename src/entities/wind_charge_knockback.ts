// Wind charge: breeze projectile. On impact applies knockback burst
// without damage; strength falls off with distance from impact.

export interface WindImpact {
  distance: number;
  maxRange: number;
}

export const WIND_CHARGE_MAX_KNOCKBACK = 2.5;

export function knockbackMagnitude(i: WindImpact): number {
  if (i.distance >= i.maxRange) return 0;
  const t = 1 - i.distance / i.maxRange;
  return WIND_CHARGE_MAX_KNOCKBACK * t;
}

// Wind charge does not deal damage.
export function damageDealt(): number {
  return 0;
}

// Activates certain blocks: copper bulbs, doors, trapdoors, buttons, levers.
export type WindActivatable =
  | 'copper_bulb'
  | 'door'
  | 'trapdoor'
  | 'button'
  | 'lever'
  | 'fence_gate';

export function activates(block: string): block is WindActivatable {
  return (
    block === 'copper_bulb' ||
    block === 'door' ||
    block === 'trapdoor' ||
    block === 'button' ||
    block === 'lever' ||
    block === 'fence_gate'
  );
}
