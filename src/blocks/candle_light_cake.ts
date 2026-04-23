export interface Candle {
  count: number;
  lit: boolean;
  onCake: boolean;
}

export function lightLevel(c: Candle): number {
  if (!c.lit) return 0;
  return Math.min(15, c.count * 3);
}

export function canPlaceMore(c: Candle): boolean {
  return !c.onCake && c.count < 4;
}

export function cakeEatBlowsOutCandle(c: Candle): boolean {
  return c.onCake && c.lit;
}
