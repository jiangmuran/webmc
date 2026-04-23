export interface EatCtx {
  gameMode: 'survival' | 'creative' | 'adventure' | 'spectator';
  hunger: number;
  maxHunger: number;
  foodSaturation: number;
}

export function canUseFood(c: EatCtx): boolean {
  if (c.gameMode === 'creative') return false;
  if (c.gameMode === 'spectator') return false;
  return c.hunger < c.maxHunger;
}

export function losesDurabilityFromSword(gameMode: EatCtx['gameMode']): boolean {
  return gameMode !== 'creative';
}
