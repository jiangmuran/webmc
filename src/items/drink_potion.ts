export type PotionKind = 'normal' | 'splash' | 'lingering';

export interface DrinkCtx {
  kind: PotionKind;
  effects: { id: string; durationTicks: number }[];
}

export const DRINK_TICKS = 32;

export function canDrink(c: DrinkCtx): boolean {
  return c.kind === 'normal';
}

export function drinkReturnsEmptyBottle(): boolean {
  return true;
}

export function effectsApplied(c: DrinkCtx): { id: string; durationTicks: number }[] {
  return canDrink(c) ? c.effects : [];
}
