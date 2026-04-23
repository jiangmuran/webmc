export interface LightCtx {
  tool: string;
  isSoulCampfire: boolean;
  alreadyLit: boolean;
}

export function lights(c: LightCtx): boolean {
  if (c.alreadyLit) return false;
  return c.tool === 'flint_and_steel' || c.tool === 'fire_charge';
}

export function extinguishableByWaterBottle(): boolean {
  return true;
}

export function damageMultiplier(isSoul: boolean): number {
  return isSoul ? 2 : 1;
}
