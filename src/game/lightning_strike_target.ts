export interface StrikeContext {
  isThundering: boolean;
  skyLight: number;
  playerIsOutside: boolean;
  wearsLightningRod: boolean;
}

export const STRIKE_CHANCE_PER_TICK = 1 / 100000;

export function canStrikeHere(c: StrikeContext): boolean {
  if (!c.isThundering) return false;
  if (c.skyLight < 15) return false;
  return true;
}

export function attractedToLightningRod(withinRadius: boolean, isLightningRod: boolean): boolean {
  return isLightningRod && withinRadius;
}

export const LIGHTNING_ROD_ATTRACTION_RADIUS = 128;
