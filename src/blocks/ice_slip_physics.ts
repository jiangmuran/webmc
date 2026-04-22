// Ice physics. Regular ice, packed_ice, frosted_ice, blue_ice with
// different slipperiness values. Players slide with reduced friction.

export type IceKind = 'ice' | 'packed_ice' | 'frosted_ice' | 'blue_ice';

export const FRICTION: Record<IceKind, number> = {
  ice: 0.98,
  packed_ice: 0.98,
  frosted_ice: 0.98,
  blue_ice: 0.989,
};

export function frictionFor(k: IceKind): number {
  return FRICTION[k];
}

// Regular ground friction: 0.6 (i.e. velocity *= 0.6 each tick).
export const GROUND_FRICTION = 0.6;

export interface MoveQuery {
  velX: number;
  velZ: number;
  onIce: IceKind | null;
}

export function applyFriction(q: MoveQuery): { velX: number; velZ: number } {
  const f = q.onIce ? frictionFor(q.onIce) : GROUND_FRICTION;
  return { velX: q.velX * f, velZ: q.velZ * f };
}

// Melting: regular ice under light ≥ 12 can melt. Packed_ice and
// blue_ice never melt; frosted_ice melts always.
export interface MeltQuery {
  kind: IceKind;
  lightLevel: number;
}

export function shouldMelt(q: MeltQuery): boolean {
  if (q.kind === 'packed_ice' || q.kind === 'blue_ice') return false;
  if (q.kind === 'frosted_ice') return true;
  return q.lightLevel >= 12;
}

// Frosted ice ages 0..3 and breaks.
export const FROSTED_ICE_MAX_AGE = 3;
