export interface DrinkCtx {
  amplifier: number;
}

export const MAX_AMPLIFIER = 5;

export function badOmenAmplifier(c: DrinkCtx): number {
  return Math.max(0, Math.min(MAX_AMPLIFIER, c.amplifier));
}

export function drinkDurationTicks(): number {
  return 32;
}

export function returnsEmptyBottle(): boolean {
  return true;
}
