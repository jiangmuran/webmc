// Pause on window blur (single-player only). In multiplayer the world
// keeps simulating; UI dims.

export interface PauseState {
  paused: boolean;
  multiplayer: boolean;
}

export function makePause(multiplayer = false): PauseState {
  return { paused: false, multiplayer };
}

export type FocusEvent = 'blur' | 'focus' | 'esc' | 'resume';

export function onEvent(s: PauseState, e: FocusEvent): void {
  if (e === 'blur') {
    if (!s.multiplayer) s.paused = true;
    return;
  }
  if (e === 'focus' || e === 'resume') {
    s.paused = false;
    return;
  }
  s.paused = !s.paused;
}

// World simulation gate.
export function worldShouldTick(s: PauseState): boolean {
  if (s.multiplayer) return true;
  return !s.paused;
}
