// Candle. Up to 4 candles stack in one block; light emission scales with
// count + lit state. Dyed in 16 colors.

export type CandleColor =
  | 'plain'
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

export interface CandleState {
  color: CandleColor;
  count: number; // 1..4
  lit: boolean;
}

export function makeCandle(color: CandleColor = 'plain'): CandleState {
  return { color, count: 1, lit: false };
}

export function addCandle(state: CandleState, color: CandleColor): boolean {
  if (state.color !== color) return false;
  if (state.count >= 4) return false;
  state.count++;
  return true;
}

export function lightCandle(state: CandleState): boolean {
  if (state.lit) return false;
  state.lit = true;
  return true;
}

export function extinguishCandle(state: CandleState): boolean {
  if (!state.lit) return false;
  state.lit = false;
  return true;
}

export function lightEmission(state: CandleState): number {
  if (!state.lit) return 0;
  return state.count * 3; // 3, 6, 9, 12
}
