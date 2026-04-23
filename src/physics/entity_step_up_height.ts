export interface StepCtx {
  entityHeightStep: number;
  blockInFrontTop: number;
  entityFeetY: number;
  onGround: boolean;
}

export function canStepUp(c: StepCtx): boolean {
  if (!c.onGround) return false;
  const heightDiff = c.blockInFrontTop - c.entityFeetY;
  return heightDiff > 0 && heightDiff <= c.entityHeightStep;
}

export function stepAmount(c: StepCtx): number {
  return canStepUp(c) ? c.blockInFrontTop - c.entityFeetY : 0;
}
