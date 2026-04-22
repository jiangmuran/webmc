// Observer block. Detects a blockstate change on the face it's
// pointing at; emits a 1-tick redstone pulse from its back.

export interface ObserverState {
  watchedStateSig: string; // signature of the watched block's state
  pulseTicksRemaining: number;
}

export const PULSE_TICKS = 1;

export function makeObserver(initial: string): ObserverState {
  return { watchedStateSig: initial, pulseTicksRemaining: 0 };
}

export interface UpdateQuery {
  newStateSig: string;
}

export function onNeighborUpdate(s: ObserverState, q: UpdateQuery): boolean {
  if (q.newStateSig === s.watchedStateSig) return false;
  s.watchedStateSig = q.newStateSig;
  s.pulseTicksRemaining = PULSE_TICKS + 1; // include current + next tick
  return true;
}

export function tickObserver(s: ObserverState): { output: number } {
  if (s.pulseTicksRemaining > 0) {
    s.pulseTicksRemaining -= 1;
    return { output: 15 };
  }
  return { output: 0 };
}
