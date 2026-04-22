// Pointer-lock (mouse capture) state. When the game is the focused tab
// AND the player clicks on the canvas, the cursor is captured (hidden)
// so raw mouse-delta drives the camera. ESC / UI-open releases.

export type CaptureState = 'uncaptured' | 'captured' | 'pending_release';

export interface MouseCaptureState {
  state: CaptureState;
  lastCaptureRequestMs: number;
}

export function makeMouseCaptureState(): MouseCaptureState {
  return { state: 'uncaptured', lastCaptureRequestMs: -Infinity };
}

export interface CaptureRequestCtx {
  nowMs: number;
  uiOpen: boolean;
  tabHasFocus: boolean;
}

export interface CaptureRequestResult {
  allowed: boolean;
  reason?: 'ui_open' | 'tab_blurred' | 'recent_request';
}

const REQUEST_COOLDOWN_MS = 1000; // browsers throttle lock attempts

export function requestCapture(
  state: MouseCaptureState,
  ctx: CaptureRequestCtx,
): CaptureRequestResult {
  if (ctx.uiOpen) return { allowed: false, reason: 'ui_open' };
  if (!ctx.tabHasFocus) return { allowed: false, reason: 'tab_blurred' };
  if (ctx.nowMs - state.lastCaptureRequestMs < REQUEST_COOLDOWN_MS) {
    return { allowed: false, reason: 'recent_request' };
  }
  state.state = 'captured';
  state.lastCaptureRequestMs = ctx.nowMs;
  return { allowed: true };
}

export function releaseCapture(state: MouseCaptureState): void {
  state.state = 'uncaptured';
}

export function onPointerLockChange(state: MouseCaptureState, locked: boolean): void {
  state.state = locked ? 'captured' : 'uncaptured';
}

// Input suppression: while not captured, mouse deltas don't steer the
// camera; only the UI receives them.
export function shouldApplyMouseToCamera(state: MouseCaptureState): boolean {
  return state.state === 'captured';
}
