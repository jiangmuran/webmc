// Cake with candle. Right-click an uneaten cake with a candle →
// cake+candle block. Right-click with flint-and-steel lights it.
// Eating extinguishes.

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

export interface CakeCandle {
  candleColor: CandleColor;
  lit: boolean;
  bitesRemaining: number;
}

export const FRESH_BITES = 7;

export function makeCakeCandle(color: CandleColor): CakeCandle {
  return { candleColor: color, lit: false, bitesRemaining: FRESH_BITES };
}

export function light(c: CakeCandle): boolean {
  if (c.bitesRemaining < FRESH_BITES) return false;
  c.lit = true;
  return true;
}

export function extinguishBySnowball(c: CakeCandle): boolean {
  if (!c.lit) return false;
  c.lit = false;
  return true;
}

// Eating an unlit cake candle proceeds like a normal cake.
export function eat(c: CakeCandle): { ate: boolean; droppedCandleColor: CandleColor | null } {
  if (c.lit) {
    c.lit = false;
    return { ate: false, droppedCandleColor: null };
  }
  if (c.bitesRemaining === FRESH_BITES) {
    c.bitesRemaining -= 1;
    return { ate: true, droppedCandleColor: c.candleColor };
  }
  if (c.bitesRemaining > 0) {
    c.bitesRemaining -= 1;
    return { ate: true, droppedCandleColor: null };
  }
  return { ate: false, droppedCandleColor: null };
}
