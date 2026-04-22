// Wither summon. T-shape of soul sand/soul soil (4 blocks) topped by
// 3 wither skulls. Both Y/X and Y/Z orientations are valid. The last
// skull placed triggers the spawn.

export type SoulBlockId = 'webmc:soul_sand' | 'webmc:soul_soil';
export type SkullId = 'webmc:wither_skeleton_skull';

export interface PatternQuery {
  at: (x: number, y: number, z: number) => string;
  px: number;
  py: number;
  pz: number;
}

const SOULS = new Set<string>(['webmc:soul_sand', 'webmc:soul_soil']);

function checkT(q: PatternQuery, axis: 'x' | 'z'): boolean {
  const dx = axis === 'x' ? 1 : 0;
  const dz = axis === 'z' ? 1 : 0;
  // Bottom: 3-wide soul blocks + 1 above-center soul
  for (let k = -1; k <= 1; k++) {
    if (!SOULS.has(q.at(q.px + k * dx, q.py, q.pz + k * dz))) return false;
  }
  if (!SOULS.has(q.at(q.px, q.py + 1, q.pz))) return false;
  // Top: 3 skulls at py+2, one per (-1, 0, 1)
  for (let k = -1; k <= 1; k++) {
    if (q.at(q.px + k * dx, q.py + 2, q.pz + k * dz) !== 'webmc:wither_skeleton_skull') {
      return false;
    }
  }
  return true;
}

export function matchesWitherPattern(q: PatternQuery): 'x' | 'z' | null {
  if (checkT(q, 'x')) return 'x';
  if (checkT(q, 'z')) return 'z';
  return null;
}

export const WITHER_MAX_HP = 300;
export const WITHER_INIT_SHIELD_TICKS = 220; // invulnerable charge
