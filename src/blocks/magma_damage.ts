// Magma block damage. Standing on a magma block without fire-resistance
// or frost-walker deals 1 HP every 0.5s. Sneaking, levitating, or riding
// a horse bypasses the damage.

export interface MagmaQuery {
  onMagma: boolean;
  sneaking: boolean;
  fireResistance: boolean;
  frostWalker: boolean;
  levitating: boolean;
  riding: boolean;
  secondsAccumulated: number;
}

const DAMAGE_INTERVAL_SEC = 0.5;
const DAMAGE_AMOUNT = 1;

export interface MagmaResult {
  damage: number;
  secondsLeft: number;
}

export function tickMagmaDamage(q: MagmaQuery, dtSec: number): MagmaResult {
  if (!q.onMagma || q.sneaking || q.fireResistance || q.frostWalker || q.levitating || q.riding) {
    return { damage: 0, secondsLeft: 0 };
  }
  const total = q.secondsAccumulated + dtSec;
  const damageTicks =
    Math.floor(total / DAMAGE_INTERVAL_SEC) -
    Math.floor(q.secondsAccumulated / DAMAGE_INTERVAL_SEC);
  return {
    damage: damageTicks * DAMAGE_AMOUNT,
    secondsLeft: total,
  };
}

// Magma block destroys any supported bubble column (and vice versa
// soul sand creates an upward bubble column).
export type BubbleSourceBlock = 'magma_block' | 'soul_sand' | 'none';

export function bubbleColumnAbove(block: BubbleSourceBlock): 'downward' | 'upward' | 'none' {
  if (block === 'magma_block') return 'downward';
  if (block === 'soul_sand') return 'upward';
  return 'none';
}

// Bubble column entity push velocity (same as ocean_current uses).
export function columnPushVy(kind: 'downward' | 'upward'): number {
  return kind === 'upward' ? 1.8 : -0.6;
}
