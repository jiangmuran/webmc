// Wither summon. T-shape of soul sand/soul soil (4 blocks) topped by
// 3 wither skulls. Both Y/X and Y/Z orientations are valid. The last
// skull placed triggers the spawn.
//
// Wiki (minecraft.wiki/w/Wither#Spawning) renders the build as
//   www
//   sss
//    s
// (top → bottom = high → low Y). So with the spawn point at the stem:
//   y=0  '.B.'   (stem soul, 1 block in centre)
//   y=1  'BBB'   (crossbar, 3 souls in a row)
//   y=2  'SSS'   (skulls on top of the crossbar)
// Old layout had 3 souls at y=0, 1 soul at y=1, and 3 skulls at y=2:
// the +/-1 skulls floated with no soul-block support, which is a build
// MC physics would not even let the player place. Sibling
// wither_summon_pattern.ts already has the wiki-canonical T.

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
  // Stem at py (1 soul block at the center).
  if (!SOULS.has(q.at(q.px, q.py, q.pz))) return false;
  // Crossbar at py+1 (3 souls in a row).
  for (let k = -1; k <= 1; k++) {
    if (!SOULS.has(q.at(q.px + k * dx, q.py + 1, q.pz + k * dz))) return false;
  }
  // Skulls at py+2 (3 skulls on top of the crossbar).
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
