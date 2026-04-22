// Surface lake feature. A small pool of water or lava carved into the
// terrain's top blocks. Lakes are flat-floored, 8×5×8 at most, with ice
// caps in cold biomes and frozen water in snowy.

export type LakeFluid = 'water' | 'lava';

export interface LakeLayout {
  fluid: LakeFluid;
  diameter: number;
  depth: number;
  iceCap: boolean;
}

export interface LakeQuery {
  rng: () => number;
  biomeTemperature: number;
}

export function planLake(q: LakeQuery): LakeLayout {
  const fluid: LakeFluid = q.rng() < 0.9 ? 'water' : 'lava';
  const diameter = 5 + Math.floor(q.rng() * 4);
  const depth = 2 + Math.floor(q.rng() * 3);
  const iceCap = fluid === 'water' && q.biomeTemperature < 0.15;
  return { fluid, diameter, depth, iceCap };
}

// Probability per chunk of a lake anchoring. Lava lakes are rarer.
export function lakeChance(biome: string, fluid: LakeFluid): number {
  if (fluid === 'lava') return 1 / 40;
  if (biome === 'desert' || biome === 'badlands') return 1 / 1000;
  return 1 / 4;
}

// Shape sampling: a lake occupies a rounded box centered at (cx, cy, cz).
export function isInsideLake(
  point: { x: number; y: number; z: number },
  center: { x: number; y: number; z: number },
  layout: LakeLayout,
): boolean {
  const dx = (point.x - center.x) / (layout.diameter / 2);
  const dy = (point.y - center.y) / (layout.depth / 2);
  const dz = (point.z - center.z) / (layout.diameter / 2);
  return dx * dx + dy * dy + dz * dz <= 1;
}
