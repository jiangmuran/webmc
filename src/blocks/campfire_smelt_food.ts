export interface SmeltCtx {
  input: string;
  ticksOnCampfire: number;
}

export const COOK_TICKS = 600;

export const COOKABLE: Record<string, string> = {
  porkchop: 'cooked_porkchop',
  beef: 'cooked_beef',
  chicken: 'cooked_chicken',
  mutton: 'cooked_mutton',
  cod: 'cooked_cod',
  salmon: 'cooked_salmon',
  rabbit: 'cooked_rabbit',
  potato: 'baked_potato',
  kelp: 'dried_kelp',
};

export function cookedResult(c: SmeltCtx): string | undefined {
  if (c.ticksOnCampfire < COOK_TICKS) return undefined;
  return COOKABLE[c.input];
}

export function canPlaceItem(input: string): boolean {
  return Object.prototype.hasOwnProperty.call(COOKABLE, input);
}
