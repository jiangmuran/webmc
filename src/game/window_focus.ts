// Window focus tracker. Pauses single-player gameplay when the tab
// loses focus; auto-pauses multiplayer after 3s of unfocus but only if
// the player is stationary and safe. Resumes immediately on refocus.

export interface FocusState {
  focused: boolean;
  blurStartedAtSec: number; // timestamp of last blur
  lastInputAtSec: number;
}

export function makeFocusState(nowSec: number): FocusState {
  return { focused: true, blurStartedAtSec: 0, lastInputAtSec: nowSec };
}

export function onBlur(state: FocusState, nowSec: number): void {
  state.focused = false;
  state.blurStartedAtSec = nowSec;
}

export function onFocus(state: FocusState, nowSec: number): void {
  state.focused = true;
  state.lastInputAtSec = nowSec;
}

export function onInput(state: FocusState, nowSec: number): void {
  state.lastInputAtSec = nowSec;
}

export interface PauseDecision {
  paused: boolean;
  reason?: 'window_blur' | 'idle_timeout';
}

export interface PauseQuery {
  state: FocusState;
  nowSec: number;
  isMultiplayer: boolean;
  isSafe: boolean;
}

const MP_AUTOPAUSE_DELAY_SEC = 3;
const IDLE_TIMEOUT_SEC = 300; // 5 min kick for AFK

export function shouldPause(q: PauseQuery): PauseDecision {
  if (!q.state.focused) {
    if (!q.isMultiplayer) return { paused: true, reason: 'window_blur' };
    const elapsed = q.nowSec - q.state.blurStartedAtSec;
    if (elapsed >= MP_AUTOPAUSE_DELAY_SEC && q.isSafe) {
      return { paused: true, reason: 'window_blur' };
    }
  }
  const idle = q.nowSec - q.state.lastInputAtSec;
  if (idle >= IDLE_TIMEOUT_SEC) {
    return { paused: true, reason: 'idle_timeout' };
  }
  return { paused: false };
}

// Mobile "app in background" detection: Page Visibility API callback.
export function onVisibilityChange(state: FocusState, visible: boolean, nowSec: number): void {
  if (visible) onFocus(state, nowSec);
  else onBlur(state, nowSec);
}
