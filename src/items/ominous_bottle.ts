// Ominous bottle. Drinking applies Bad Omen level matching the bottle's
// amplifier (0..4). Amplifier encodes omen strength for trial spawners.

export interface OminousBottle {
  amplifier: 0 | 1 | 2 | 3 | 4;
}

export const BAD_OMEN_DURATION_TICKS = 100 * 60 * 20; // 100 minutes

export interface DrinkResult {
  effect: 'bad_omen';
  amplifier: number;
  durationTicks: number;
}

export function drink(b: OminousBottle): DrinkResult {
  return {
    effect: 'bad_omen',
    amplifier: b.amplifier,
    durationTicks: BAD_OMEN_DURATION_TICKS,
  };
}

export function badOmenToTrialOmen(level: number): number {
  // Bad Omen in a trial chamber is converted to Trial Omen of same level.
  return Math.max(0, Math.min(4, level));
}
