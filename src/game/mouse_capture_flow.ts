// Pointer lock flow. Click canvas → request pointer lock. Esc or
// window blur → release. Cooldown between requests to avoid "too
// many requests" browser-level blocks.

export interface PointerLockState {
  locked: boolean;
  lastRequestMs: number;
  pending: boolean;
}

export const REQUEST_COOLDOWN_MS = 1500;

export function makeLockState(): PointerLockState {
  return { locked: false, lastRequestMs: -Infinity, pending: false };
}

export interface ClickQuery {
  nowMs: number;
}

export function tryRequestLock(
  s: PointerLockState,
  q: ClickQuery,
): 'requested' | 'cooldown' | 'already_locked' {
  if (s.locked) return 'already_locked';
  if (q.nowMs - s.lastRequestMs < REQUEST_COOLDOWN_MS) return 'cooldown';
  s.lastRequestMs = q.nowMs;
  s.pending = true;
  return 'requested';
}

export function onLocked(s: PointerLockState): void {
  s.locked = true;
  s.pending = false;
}

export function onUnlocked(s: PointerLockState): void {
  s.locked = false;
  s.pending = false;
}

// When unlocked due to esc, keep a small grace period before the next
// request can succeed.
export const ESC_GRACE_MS = 500;

export function onEsc(s: PointerLockState, nowMs: number): void {
  onUnlocked(s);
  s.lastRequestMs = nowMs - REQUEST_COOLDOWN_MS + ESC_GRACE_MS;
}
