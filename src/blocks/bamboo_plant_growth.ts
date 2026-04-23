export type BambooStage = 'sapling' | 'small' | 'large';

export interface BambooColumn {
  totalHeight: number;
  ageBoost: boolean;
}

export const MAX_HEIGHT = 16;
export const SMALL_STAGE_AT = 4;
export const LARGE_STAGE_AT = 6;

export function stageForHeight(height: number, columnTop: number): BambooStage {
  if (columnTop - height <= 0) return 'sapling';
  if (columnTop >= LARGE_STAGE_AT && columnTop - height >= 2) return 'large';
  if (columnTop >= SMALL_STAGE_AT && columnTop - height >= 1) return 'small';
  return 'sapling';
}

export function growChance(c: BambooColumn, rng: () => number): boolean {
  if (c.totalHeight >= MAX_HEIGHT) return false;
  const base = c.ageBoost ? 0.25 : 0.1;
  return rng() < base;
}

export function bonemealGrowth(c: BambooColumn): number {
  const remaining = MAX_HEIGHT - c.totalHeight;
  return Math.min(remaining, 2);
}
