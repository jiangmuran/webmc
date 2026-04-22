// Cactus growth. Grows vertically on sand; max height 3. Growth attempts
// at random tick with 1/16 probability. Adjacent solid blocks in a 1-block
// radius break the cactus (cactus is allergic to neighbors).

export interface CactusGrowCtx {
  height: number; // current cactus column height
  sandBelow: boolean;
  sideNeighborSolid: boolean;
  roll: number;
}

export const CACTUS_MAX_HEIGHT = 3;
const GROW_CHANCE = 1 / 16;

export type CactusTickResult = 'grew' | 'broke' | 'none';

export function tickCactus(ctx: CactusGrowCtx): CactusTickResult {
  if (!ctx.sandBelow && ctx.height === 1) return 'broke';
  if (ctx.sideNeighborSolid) return 'broke';
  if (ctx.height >= CACTUS_MAX_HEIGHT) return 'none';
  if (ctx.roll >= GROW_CHANCE) return 'none';
  return 'grew';
}

// Cactus damages entities standing on it (1 HP/half-second). Returns the
// damage to apply for `dtSec`.
export function cactusContactDamage(dtSec: number): number {
  return dtSec * 2; // 1 HP per 0.5s
}

// Sugar cane uses the same growth model as cactus but only needs an
// adjacent water block to survive.
export interface SugarCaneGrowCtx {
  height: number;
  baseOnSandOrDirt: boolean;
  waterAdjacent: boolean;
  roll: number;
}

export const SUGAR_CANE_MAX_HEIGHT = 3;

export function tickSugarCane(ctx: SugarCaneGrowCtx): CactusTickResult {
  if (!ctx.baseOnSandOrDirt && ctx.height === 1) return 'broke';
  if (ctx.height === 1 && !ctx.waterAdjacent) return 'broke';
  if (ctx.height >= SUGAR_CANE_MAX_HEIGHT) return 'none';
  if (ctx.roll >= GROW_CHANCE) return 'none';
  return 'grew';
}
