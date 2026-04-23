export interface CrafterCtx {
  recipeComplete: boolean;
  cooldownTicks: number;
  powered: boolean;
}

export const EJECT_COOLDOWN = 4;

export function canCraftNow(c: CrafterCtx): boolean {
  return c.powered && c.recipeComplete && c.cooldownTicks <= 0;
}

export function onCraft(_c: CrafterCtx): CrafterCtx {
  return { recipeComplete: false, cooldownTicks: EJECT_COOLDOWN, powered: false };
}

export function redstonePulseDetection(risingEdge: boolean, currentlyPowered: boolean): boolean {
  return risingEdge && !currentlyPowered;
}
