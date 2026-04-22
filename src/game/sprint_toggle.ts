// Sprint toggle. Either double-tap W (within 300ms) or hold Ctrl to
// sprint. Stops on obstacle, sneak, or hunger drop.

export interface SprintState {
  active: boolean;
  lastForwardReleaseMs: number;
  lastForwardPressMs: number;
  doubleTappedThisPress: boolean;
}

export const DOUBLE_TAP_WINDOW_MS = 300;

export function makeSprint(): SprintState {
  return {
    active: false,
    lastForwardReleaseMs: -Infinity,
    lastForwardPressMs: -Infinity,
    doubleTappedThisPress: false,
  };
}

export interface Input {
  forwardPressed: boolean;
  ctrlPressed: boolean;
  sneakPressed: boolean;
  hunger: number;
  nowMs: number;
  collided: boolean;
}

export interface TransitionResult {
  startedSprint: boolean;
  stoppedSprint: boolean;
}

export function transition(prev: Input, cur: Input, s: SprintState): TransitionResult {
  const justPressed = cur.forwardPressed && !prev.forwardPressed;
  const justReleased = !cur.forwardPressed && prev.forwardPressed;

  let startedSprint = false;
  let stoppedSprint = false;

  if (justReleased) {
    s.lastForwardReleaseMs = cur.nowMs;
  }

  if (justPressed) {
    if (cur.nowMs - s.lastForwardReleaseMs < DOUBLE_TAP_WINDOW_MS) {
      s.doubleTappedThisPress = true;
    } else {
      s.doubleTappedThisPress = false;
    }
    s.lastForwardPressMs = cur.nowMs;
  }

  const wantSprint =
    (cur.ctrlPressed || s.doubleTappedThisPress) &&
    cur.forwardPressed &&
    !cur.sneakPressed &&
    cur.hunger > 6 &&
    !cur.collided;

  if (wantSprint && !s.active) {
    s.active = true;
    startedSprint = true;
  } else if (!wantSprint && s.active) {
    s.active = false;
    stoppedSprint = true;
  }

  return { startedSprint, stoppedSprint };
}
