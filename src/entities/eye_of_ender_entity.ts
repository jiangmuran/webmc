export interface Pos3 {
  x: number;
  y: number;
  z: number;
}

export const RISE_SPEED = 0.6;
export const FORWARD_SPEED = 1.25;
export const LIFE_TICKS = 80;

export function nextPos(p: Pos3, target: Pos3, tick: number): Pos3 {
  const dx = target.x - p.x;
  const dz = target.z - p.z;
  const d = Math.hypot(dx, dz);
  const riseEnding = tick > LIFE_TICKS * 0.75;
  const vy = riseEnding ? -RISE_SPEED : RISE_SPEED * (tick < 10 ? 1 : 0.2);
  if (d === 0) return { x: p.x, y: p.y + vy, z: p.z };
  const fx = (dx / d) * FORWARD_SPEED;
  const fz = (dz / d) * FORWARD_SPEED;
  return { x: p.x + fx, y: p.y + vy, z: p.z + fz };
}

export function shouldBreak(rng: () => number): boolean {
  return rng() < 0.2;
}
