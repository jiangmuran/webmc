// Candle stacking. 1-4 candles per block, each emits light (lit
// varies: 3 → 3 light, 2 → 6, etc.). Snowball extinguishes. Waterlogged
// candle is unlit.

export type CandleColor =
  | 'white'
  | 'orange'
  | 'magenta'
  | 'light_blue'
  | 'yellow'
  | 'lime'
  | 'pink'
  | 'gray'
  | 'light_gray'
  | 'cyan'
  | 'purple'
  | 'blue'
  | 'brown'
  | 'green'
  | 'red'
  | 'black';

export interface CandleBlock {
  color: CandleColor;
  count: number; // 1..4
  lit: boolean;
  waterlogged: boolean;
}

export const MAX_CANDLES = 4;

export function makeCandle(color: CandleColor): CandleBlock {
  return { color, count: 1, lit: false, waterlogged: false };
}

export function stack(c: CandleBlock, addingColor: CandleColor): boolean {
  if (c.color !== addingColor) return false;
  if (c.count >= MAX_CANDLES) return false;
  c.count += 1;
  return true;
}

export function light(c: CandleBlock): boolean {
  if (c.waterlogged) return false;
  c.lit = true;
  return true;
}

export function extinguish(c: CandleBlock): boolean {
  if (!c.lit) return false;
  c.lit = false;
  return true;
}

// Light emitted per candle count.
export function lightLevel(c: CandleBlock): number {
  if (!c.lit || c.waterlogged) return 0;
  return c.count * 3;
}

export function setWaterlog(c: CandleBlock, water: boolean): void {
  c.waterlogged = water;
  if (water) c.lit = false;
}
