// Cake. Placed on the ground, eaten in 7 bites by right-click. Each bite
// restores 2 hunger. Candle-cakes are lit by flint+steel, eaten by first
// extinguishing the candle.

export interface CakeState {
  bites: number; // 0..6
  candle: null | {
    color: string;
    lit: boolean;
  };
}

const MAX_BITES = 6;

export function makeCake(candleColor?: string): CakeState {
  return {
    bites: 0,
    candle: candleColor ? { color: candleColor, lit: false } : null,
  };
}

export interface CakeEater {
  eat(hunger: number, saturation: number): boolean;
}

export interface BiteResult {
  ateBite: boolean;
  consumed: boolean;
}

export function biteCake(state: CakeState, eater: CakeEater): BiteResult {
  if (state.candle?.lit) return { ateBite: false, consumed: false };
  // Candle-cake's candle pops off before the first bite.
  if (state.candle && !state.candle.lit && state.bites === 0) {
    state.candle = null;
  }
  const ok = eater.eat(2, 0.4);
  if (!ok) return { ateBite: false, consumed: false };
  state.bites++;
  return { ateBite: true, consumed: state.bites > MAX_BITES };
}

export function igniteCandle(state: CakeState): boolean {
  if (!state.candle) return false;
  if (state.candle.lit) return false;
  state.candle.lit = true;
  return true;
}

export function extinguishCandle(state: CakeState): boolean {
  if (!state.candle) return false;
  if (!state.candle.lit) return false;
  state.candle.lit = false;
  return true;
}

export function comparatorSignal(state: CakeState): number {
  return (MAX_BITES + 1 - state.bites) * 2;
}
