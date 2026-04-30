export const DIG_CHANCE_PER_ATTEMPT = 0.25;
// Wiki (minecraft.wiki/w/Sniffer): "After sniffing out seeds, an
// eight-minute cooldown is activated before it can search again."
// 8 min = 480 s = 9600 ticks. Old DIG_COOLDOWN_TICKS = 200 (10 s)
// was 48× too short — sniffers would dig non-stop instead of the
// long wiki-canonical pause. Sibling sniffer_dig.ts and
// entities/sniffer.ts already use this value (or equivalents).
export const DIG_COOLDOWN_TICKS = 9600;

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
