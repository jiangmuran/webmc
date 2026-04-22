// Projectile penetration. Piercing (crossbow) arrows pass through N
// entities. Normal arrows stop at first hit. Tridents with Loyalty
// return. We expose pierce counter.

export interface ProjectileHits {
  hitEntityIds: Set<string>;
  pierceRemaining: number;
}

export function makeArrow(pierceLevel = 0): ProjectileHits {
  return { hitEntityIds: new Set(), pierceRemaining: pierceLevel };
}

export interface HitQuery {
  entityId: string;
}

export interface HitResult {
  hit: boolean;
  stops: boolean;
}

export function onHit(p: ProjectileHits, q: HitQuery): HitResult {
  if (p.hitEntityIds.has(q.entityId)) return { hit: false, stops: false };
  p.hitEntityIds.add(q.entityId);
  if (p.pierceRemaining > 0) {
    p.pierceRemaining -= 1;
    return { hit: true, stops: false };
  }
  return { hit: true, stops: true };
}

// Channeling trident in thunderstorm can summon lightning on hit.
export interface ChannelingQuery {
  enchantLevel: number;
  thunderstorm: boolean;
  targetInOpenSky: boolean;
}

export function shouldCallLightning(q: ChannelingQuery): boolean {
  return q.enchantLevel > 0 && q.thunderstorm && q.targetInOpenSky;
}
