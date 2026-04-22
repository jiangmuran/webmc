// Pointed dripstone impale damage. An entity falling onto an upward-
// pointing stalagmite tip takes (fallDistance × 2) HP damage, capped at
// 40 HP. A tip falling from the ceiling onto an entity deals base
// 6 HP or 12 HP with "large" tip size.

export type DripstoneOrientation = 'up' | 'down';
export type DripstoneSize = 'tip' | 'frustum' | 'middle' | 'base';

export interface DripstoneTip {
  orientation: DripstoneOrientation;
  size: DripstoneSize;
}

export interface FallImpaleQuery {
  dripstone: DripstoneTip;
  fallDistance: number;
  armorAbsorption: number; // 0..1 portion of damage negated by armor
}

export interface ImpaleResult {
  damage: number;
  stuckOnTip: boolean;
}

const IMPALE_DAMAGE_MULTIPLIER = 2;
const MAX_IMPALE_DAMAGE = 40;

export function impaleOnFall(q: FallImpaleQuery): ImpaleResult {
  if (q.dripstone.orientation !== 'up' || q.dripstone.size !== 'tip') {
    return { damage: 0, stuckOnTip: false };
  }
  if (q.fallDistance <= 0) return { damage: 0, stuckOnTip: false };
  const base = Math.min(MAX_IMPALE_DAMAGE, q.fallDistance * IMPALE_DAMAGE_MULTIPLIER);
  const final = base * (1 - Math.max(0, Math.min(1, q.armorAbsorption)));
  return { damage: final, stuckOnTip: true };
}

// Falling-tip damage: a stalactite dislodged from the ceiling (by a
// piston or gravity) that hits an entity below.
export interface FallingTipQuery {
  size: DripstoneSize;
}

export function fallingTipDamage(q: FallingTipQuery): number {
  if (q.size === 'tip') return 12;
  return 6;
}

// Check whether a stalactite dislodges from above when unsupported. A
// tip is supported by a larger dripstone above it or by deepslate/stone.
export interface SupportQuery {
  aboveBlock: string;
  aboveIsDripstone: boolean;
}

export function isSupported(q: SupportQuery): boolean {
  if (q.aboveIsDripstone) return true;
  const solids = ['webmc:stone', 'webmc:deepslate', 'webmc:dripstone_block'];
  return solids.includes(q.aboveBlock);
}
