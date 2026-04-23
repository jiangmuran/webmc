export const DIG_CHANCE_PER_ATTEMPT = 0.25;
export const DIG_COOLDOWN_TICKS = 200;

export interface SnifferState {
  currentTask: 'idle' | 'sniff' | 'dig';
  taskTicks: number;
}

export function shouldStartDigging(s: SnifferState, rng: () => number): boolean {
  if (s.currentTask !== 'sniff') return false;
  return rng() < DIG_CHANCE_PER_ATTEMPT;
}

export function dropsOnComplete(rng: () => number): string {
  return rng() < 0.7 ? 'torchflower_seeds' : 'pitcher_pod';
}
