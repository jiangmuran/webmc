export type BlockId = string;

export interface WitherPattern {
  blocks: readonly BlockId[][][];
}

const SOUL_BASES = new Set(['soul_sand', 'soul_soil']);

export function detectTShape(
  atX: number,
  atY: number,
  atZ: number,
  get: (x: number, y: number, z: number) => BlockId,
  axis: 'x' | 'z',
): boolean {
  const [dx, dz] = axis === 'x' ? [1, 0] : [0, 1];
  const base: [number, number, number][] = [
    [atX, atY, atZ],
    [atX + dx, atY, atZ + dz],
    [atX - dx, atY, atZ - dz],
    [atX, atY + 1, atZ],
    [atX + dx, atY + 1, atZ + dz],
    [atX - dx, atY + 1, atZ - dz],
  ];
  const skulls: [number, number, number][] = [
    [atX, atY + 2, atZ],
    [atX + dx, atY + 2, atZ + dz],
    [atX - dx, atY + 2, atZ - dz],
  ];
  for (const [x, y, z] of base) {
    if (!SOUL_BASES.has(get(x, y, z))) return false;
  }
  for (const [x, y, z] of skulls) {
    if (get(x, y, z) !== 'wither_skeleton_skull') return false;
  }
  return true;
}
