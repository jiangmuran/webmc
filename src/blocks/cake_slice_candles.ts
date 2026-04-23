export interface Cake {
  slicesLeft: number;
  candleColor?: string;
  candleLit: boolean;
}

export const MAX_SLICES = 7;
export const HUNGER_PER_SLICE = 2;

export function eatSlice(c: Cake): Cake {
  if (c.slicesLeft <= 0) return c;
  return { ...c, slicesLeft: c.slicesLeft - 1 };
}

export function cakeBlockBroken(c: Cake): boolean {
  return c.slicesLeft <= 0;
}

export function canPutCandle(c: Cake, colorIfAny?: string): Cake {
  if (c.candleColor !== undefined) return c;
  if (c.slicesLeft < MAX_SLICES) return c;
  return {
    ...c,
    ...(colorIfAny !== undefined ? { candleColor: colorIfAny } : {}),
    candleLit: false,
  };
}
