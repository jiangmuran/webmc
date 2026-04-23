export interface XpOrb {
  x: number;
  y: number;
  z: number;
  value: number;
  ageTicks: number;
}

export const PICKUP_RADIUS = 1.5;
export const ATTRACT_RADIUS = 8;
export const LIFETIME_TICKS = 20 * 60 * 5;

export function inPickupRange(orb: XpOrb, px: number, py: number, pz: number): boolean {
  const d = Math.hypot(orb.x - px, orb.y - py, orb.z - pz);
  return d <= PICKUP_RADIUS;
}

export function attractVelocity(
  orb: XpOrb,
  px: number,
  py: number,
  pz: number,
): { dx: number; dy: number; dz: number } {
  const dx = px - orb.x;
  const dy = py - orb.y;
  const dz = pz - orb.z;
  const d = Math.hypot(dx, dy, dz);
  if (d > ATTRACT_RADIUS || d === 0) return { dx: 0, dy: 0, dz: 0 };
  const s = (1 - d / ATTRACT_RADIUS) * 0.8;
  return { dx: (dx / d) * s, dy: (dy / d) * s, dz: (dz / d) * s };
}

export function expired(orb: XpOrb): boolean {
  return orb.ageTicks >= LIFETIME_TICKS;
}
