export interface WaterCell {
  flowLevel: number;
  falling: boolean;
  neighbors: {
    north?: number;
    south?: number;
    east?: number;
    west?: number;
  };
}

export function flowDirection(c: WaterCell): { dx: number; dz: number } {
  const ns = (c.neighbors.north ?? c.flowLevel) - (c.neighbors.south ?? c.flowLevel);
  const ew = (c.neighbors.east ?? c.flowLevel) - (c.neighbors.west ?? c.flowLevel);
  const len = Math.hypot(ns, ew);
  if (len === 0) return { dx: 0, dz: 0 };
  return { dx: ew / len, dz: ns / len };
}

export function pushVelocity(
  c: WaterCell,
  baseStrength = 0.014,
): { vx: number; vy: number; vz: number } {
  const d = flowDirection(c);
  return {
    vx: d.dx * baseStrength,
    vy: c.falling ? -baseStrength : 0,
    vz: d.dz * baseStrength,
  };
}
