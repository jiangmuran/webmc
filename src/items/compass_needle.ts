export interface Pos {
  x: number;
  z: number;
}

export function angleToSpawn(from: Pos, spawn: Pos): number {
  const dx = spawn.x - from.x;
  const dz = spawn.z - from.z;
  return Math.atan2(dz, dx);
}

export function spinsInDimension(dim: 'overworld' | 'nether' | 'end'): boolean {
  return dim !== 'overworld';
}

export function lodestoneOverrides(lodestone?: Pos): boolean {
  return lodestone !== undefined;
}
