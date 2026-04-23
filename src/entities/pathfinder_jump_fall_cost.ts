export interface MoveCost {
  from: { x: number; y: number; z: number };
  to: { x: number; y: number; z: number };
  canJumpUp: boolean;
  canFall: boolean;
  underwater: boolean;
}

export function pathCost(m: MoveCost): number | undefined {
  const dx = m.to.x - m.from.x;
  const dy = m.to.y - m.from.y;
  const dz = m.to.z - m.from.z;
  const base = Math.hypot(dx, dz);
  if (dy > 1) return undefined;
  if (dy === 1 && !m.canJumpUp) return undefined;
  if (dy < -1 && !m.canFall) return undefined;
  let cost = base;
  if (dy === 1) cost += 0.5;
  if (dy < 0) cost += Math.abs(dy) * 0.3;
  if (m.underwater) cost *= 2;
  return cost;
}
