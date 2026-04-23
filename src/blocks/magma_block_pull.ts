export interface MagmaCtx {
  waterAbove: boolean;
  entityOnTop: boolean;
  sneaking: boolean;
}

export const BUBBLE_COLUMN_DOWNWARD_FORCE = 0.9;
export const FIRE_DAMAGE_ON_STEP = 1;

export function createsDownwardBubble(c: MagmaCtx): boolean {
  return c.waterAbove;
}

export function damagesOnStep(c: MagmaCtx): boolean {
  return c.entityOnTop && !c.sneaking;
}

export function fallDamageNegated(): boolean {
  return false;
}
