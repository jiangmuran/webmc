// Projectile bounce / collision response. Snowballs, eggs, ender
// pearls, splash potions hit-and-expire on contact. Thrown items
// (fishing hook) bounce. Arrows stick. Tridents stick unless Loyalty.
// This module centralizes the "what happens on impact" logic.

export type ProjectileKind =
  | 'snowball'
  | 'egg'
  | 'ender_pearl'
  | 'splash_potion'
  | 'lingering_potion'
  | 'arrow'
  | 'trident'
  | 'fishing_hook'
  | 'fireball'
  | 'wither_skull';

export type ImpactSurface = 'block' | 'entity' | 'water' | 'lava';

export interface ImpactQuery {
  kind: ProjectileKind;
  surface: ImpactSurface;
  loyaltyLevel?: number;
  riptideLevel?: number;
}

export type ImpactResolution = 'expire' | 'stick' | 'bounce' | 'return';

export function resolveImpact(q: ImpactQuery): ImpactResolution {
  switch (q.kind) {
    case 'snowball':
    case 'egg':
    case 'splash_potion':
    case 'lingering_potion':
    case 'fireball':
    case 'wither_skull':
      return 'expire';
    case 'ender_pearl':
      return 'expire'; // pearl teleports the owner then disappears
    case 'arrow':
      return q.surface === 'block' ? 'stick' : 'expire';
    case 'trident':
      if (q.surface === 'block') {
        return q.loyaltyLevel && q.loyaltyLevel > 0 ? 'return' : 'stick';
      }
      return 'expire';
    case 'fishing_hook':
      return q.surface === 'water' ? 'stick' : 'bounce';
  }
}

// Projectile damage on entity impact.
const DIRECT_DAMAGE: Record<ProjectileKind, number> = {
  snowball: 0, // 3 vs blaze only (handled separately)
  egg: 0,
  ender_pearl: 0,
  splash_potion: 0,
  lingering_potion: 0,
  arrow: 0, // computed elsewhere via velocity
  trident: 0, // computed elsewhere
  fishing_hook: 0,
  fireball: 6,
  wither_skull: 8,
};

export function directDamageOn(kind: ProjectileKind, targetIsBlaze: boolean): number {
  if (kind === 'snowball' && targetIsBlaze) return 3;
  return DIRECT_DAMAGE[kind];
}

// Snowball against any mob does no damage except blaze.
export function snowballAppliesDamage(targetIsBlaze: boolean): boolean {
  return targetIsBlaze;
}
