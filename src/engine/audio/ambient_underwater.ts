export const UNDERWATER_AMBIENT_MIN_INTERVAL = 20 * 10;
export const UNDERWATER_AMBIENT_MAX_INTERVAL = 20 * 40;
export const UNDERWATER_RARE_MAX_INTERVAL = 20 * 180;

export interface AmbientState {
  submerged: boolean;
  ticksUntilNextLoop: number;
  ticksUntilNextRare: number;
}

export function tickUnderwater(
  s: AmbientState,
  rng: () => number,
): {
  state: AmbientState;
  play?: string;
} {
  if (!s.submerged) return { state: s };
  let { ticksUntilNextLoop, ticksUntilNextRare } = s;
  let play: string | undefined;
  ticksUntilNextLoop -= 1;
  ticksUntilNextRare -= 1;
  if (ticksUntilNextLoop <= 0) {
    play = 'ambient.underwater.loop';
    ticksUntilNextLoop =
      UNDERWATER_AMBIENT_MIN_INTERVAL +
      Math.floor(rng() * (UNDERWATER_AMBIENT_MAX_INTERVAL - UNDERWATER_AMBIENT_MIN_INTERVAL));
  } else if (ticksUntilNextRare <= 0) {
    play = 'ambient.underwater.rare';
    ticksUntilNextRare = Math.floor(rng() * UNDERWATER_RARE_MAX_INTERVAL);
  }
  const nextState: AmbientState = { ...s, ticksUntilNextLoop, ticksUntilNextRare };
  return play === undefined ? { state: nextState } : { state: nextState, play };
}
