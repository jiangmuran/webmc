export interface DanceCtx {
  justBarteredTick: number;
  now: number;
}

export const DANCE_DURATION = 60;

export function isDancing(c: DanceCtx): boolean {
  return c.now - c.justBarteredTick < DANCE_DURATION;
}

export function emitsHappyParticle(c: DanceCtx): boolean {
  return isDancing(c);
}
