// Piercing (crossbow). Arrows pass through up to level+1 entities/shields.

export const PIERCING_MAX = 4;

export function maxPierces(level: number): number {
  return Math.max(0, Math.min(PIERCING_MAX, level));
}

export interface ArrowFlight {
  piercesLeft: number;
  hitEntities: Set<string>;
}

export function initArrow(level: number): ArrowFlight {
  return { piercesLeft: maxPierces(level), hitEntities: new Set() };
}

export function onHit(a: ArrowFlight, entityId: string): { removed: boolean; damaged: boolean } {
  if (a.hitEntities.has(entityId)) return { removed: false, damaged: false };
  a.hitEntities.add(entityId);
  if (a.piercesLeft <= 0) return { removed: true, damaged: true };
  a.piercesLeft--;
  return { removed: false, damaged: true };
}

export function incompatibleWith(): string[] {
  return ['multishot'];
}
