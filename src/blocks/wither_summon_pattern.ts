export type BlockId = string;

export interface WitherPattern {
  blocks: readonly BlockId[][][];
}

const SOUL_BASES = new Set(['soul_sand', 'soul_soil']);

// Wiki (minecraft.wiki/w/Wither#Construction): the summon structure
// is a 'T' — 1 soul block at the bottom center (stem), 3 soul blocks
// above it (top of T), and 3 wither_skeleton_skulls on top of the
// row. Old detector required 6 soul blocks (a 3×3 base + a top row),
// which is a SOLID base, not a T. atY+0 layer needed only the
// center block.
//
// Layout for axis='x', atX=0, atY=0, atZ=0:
//   y=2:  S S S      (skulls)
//   y=1:  B B B      (top of T, 3 soul blocks)
//   y=0:  . B .      (stem of T, 1 soul block at center)
export function detectTShape(
  atX: number,
  atY: number,
  atZ: number,
  get: (x: number, y: number, z: number) => BlockId,
  axis: 'x' | 'z',
): boolean {
  const [dx, dz] = axis === 'x' ? [1, 0] : [0, 1];
  const base: [number, number, number][] = [
    // Stem (bottom center only).
    [atX, atY, atZ],
    // Top row of the T (3 in a row).
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
