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

// Wiki (minecraft.wiki/w/Sniffer): "they sploot and use their snouts
// to dig into the ground until they get torchflower seeds or a
// pitcher pod, with an equal chance of digging up either one."
// Old split was 70/30 (torchflower-favored); wiki says 50/50.
export function dropsOnComplete(rng: () => number): string {
  return rng() < 0.5 ? 'torchflower_seeds' : 'pitcher_pod';
}
