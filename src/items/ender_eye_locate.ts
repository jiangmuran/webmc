export interface Pos {
  x: number;
  z: number;
}

export const BREAK_CHANCE = 0.2;
export const FLIGHT_TIME_TICKS = 80;
export const RISE_HEIGHT_BLOCKS = 12;

export function directionToTarget(from: Pos, target: Pos): { dx: number; dz: number } {
  const dx = target.x - from.x;
  const dz = target.z - from.z;
  const len = Math.hypot(dx, dz);
  return len === 0 ? { dx: 0, dz: 0 } : { dx: dx / len, dz: dz / len };
}

export function shouldBreak(rng: () => number): boolean {
  return rng() < BREAK_CHANCE;
}
