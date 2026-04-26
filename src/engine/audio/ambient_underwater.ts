export const UNDERWATER_AMBIENT_MIN_INTERVAL = 20 * 10;
export const UNDERWATER_AMBIENT_MAX_INTERVAL = 20 * 40;
export const UNDERWATER_RARE_MAX_INTERVAL = 20 * 180;

export interface AmbientState {
  submerged: boolean;
  ticksUntilNextLoop: number;
  ticksUntilNextRare: number;
}

// Reused result object — was allocating fresh literals per per-frame
// call. Mutates the input state in place; the state field still points
// to the same object so callers that round-trip via `ua.state` see the
// updated values.
const tickUnderwaterResult: { state: AmbientState; play: string | undefined } = {
  state: { submerged: false, ticksUntilNextLoop: 0, ticksUntilNextRare: 0 },
  play: undefined,
};

export function tickUnderwater(
  s: AmbientState,
  rng: () => number,
): {
  state: AmbientState;
  play: string | undefined;
} {
  tickUnderwaterResult.state = s;
  tickUnderwaterResult.play = undefined;
  if (!s.submerged) return tickUnderwaterResult;
  s.ticksUntilNextLoop -= 1;
  s.ticksUntilNextRare -= 1;
  if (s.ticksUntilNextLoop <= 0) {
    tickUnderwaterResult.play = 'ambient.underwater.loop';
    s.ticksUntilNextLoop =
      UNDERWATER_AMBIENT_MIN_INTERVAL +
      Math.floor(rng() * (UNDERWATER_AMBIENT_MAX_INTERVAL - UNDERWATER_AMBIENT_MIN_INTERVAL));
  } else if (s.ticksUntilNextRare <= 0) {
    tickUnderwaterResult.play = 'ambient.underwater.rare';
    s.ticksUntilNextRare = Math.floor(rng() * UNDERWATER_RARE_MAX_INTERVAL);
  }
  return tickUnderwaterResult;
}
