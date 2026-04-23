// Step-up helper. When entity is blocked horizontally but can rise by
// ≤ stepHeight to clear the obstacle, raise its y.

export interface CollideCtx {
  blockedLow: boolean;
  clearanceAbove: boolean;
  verticalClearanceAtStep: number;
  stepHeight: number;
  onGround: boolean;
}

export function shouldStepUp(c: CollideCtx): boolean {
  if (!c.onGround) return false;
  if (!c.blockedLow) return false;
  if (!c.clearanceAbove) return false;
  return c.verticalClearanceAtStep <= c.stepHeight;
}

export const DEFAULT_STEP_HEIGHT = 0.6;
export const HORSE_STEP_HEIGHT = 1.0;

export function stepHeightFor(entity: 'player' | 'horse' | 'zombie' | 'creeper'): number {
  if (entity === 'horse') return HORSE_STEP_HEIGHT;
  return DEFAULT_STEP_HEIGHT;
}
