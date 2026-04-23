export type Dim = 'overworld' | 'nether';

export function mappedCoords(from: Dim, pos: { x: number; z: number }): { x: number; z: number } {
  if (from === 'overworld') {
    return { x: Math.floor(pos.x / 8), z: Math.floor(pos.z / 8) };
  }
  return { x: pos.x * 8, z: pos.z * 8 };
}

export function searchRadius(): number {
  return 128;
}

export function yClampNether(y: number): number {
  return Math.max(0, Math.min(127, y));
}
