export type WitchPotion = 'heal' | 'speed' | 'fire_resistance' | 'water_breathing';

export interface WitchContext {
  healthFraction: number;
  onFire: boolean;
  inWater: boolean;
  underAttack: boolean;
}

export function pickPotion(ctx: WitchContext): WitchPotion | undefined {
  if (ctx.onFire) return 'fire_resistance';
  if (ctx.inWater) return 'water_breathing';
  if (ctx.healthFraction < 0.5) return 'heal';
  if (ctx.underAttack) return 'speed';
  return undefined;
}

export const DRINK_DURATION_TICKS = 20;

export function tickDrink(remainingTicks: number): { done: boolean; remaining: number } {
  const r = Math.max(0, remainingTicks - 1);
  return { done: r === 0, remaining: r };
}
