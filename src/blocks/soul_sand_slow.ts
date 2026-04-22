// Soul sand / soul soil walking modifier. Standing on soul sand/soil
// halves walking speed unless wearing Soul Speed boots (see
// game/soul_speed.ts). Soul sand's top is 7/8 of a block, so entities
// sink slightly. Soul soil is fully square but same slow effect.

export type SoulBlock = 'webmc:soul_sand' | 'webmc:soul_soil';

export function isSoulBlock(blockId: string): blockId is SoulBlock {
  return blockId === 'webmc:soul_sand' || blockId === 'webmc:soul_soil';
}

export const SOUL_SPEED_FRACTION = 0.4;

export interface SoulSpeedQuery {
  blockBelow: string;
  baseSpeed: number;
  soulSpeedLevel: number;
  iceOverlaid: boolean; // soul sand under ice = mobs sink + pass-through
}

export function speedOnSoul(q: SoulSpeedQuery): number {
  if (!isSoulBlock(q.blockBelow)) return q.baseSpeed;
  if (q.soulSpeedLevel > 0) {
    const boost = 1 + 0.4 + 0.1 * Math.min(3, q.soulSpeedLevel);
    return q.baseSpeed * boost;
  }
  return q.baseSpeed * SOUL_SPEED_FRACTION;
}

// Entities standing on soul sand sink 0.125 blocks; soul soil doesn't.
export function sinkDepthFor(blockId: string): number {
  if (blockId === 'webmc:soul_sand') return 0.125;
  return 0;
}

// Soul fire is blue and deals more damage than regular fire.
export const SOUL_FIRE_DAMAGE_BONUS = 2;

// Soul campfire extinguishes flame mobs (phantoms, blazes) even faster —
// they take double contact damage.
export function soulFireDamageTo(mob: string, baseDamage: number): number {
  const vulnerable = new Set(['phantom', 'blaze']);
  return vulnerable.has(mob) ? baseDamage * 2 : baseDamage;
}
