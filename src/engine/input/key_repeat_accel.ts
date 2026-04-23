export const INITIAL_DELAY_MS = 400;
export const REPEAT_INTERVAL_MS = 80;

export interface KeyHoldState {
  firstHeldAtMs: number;
  lastFireAtMs: number;
}

export function shouldFire(s: KeyHoldState, nowMs: number): boolean {
  if (nowMs - s.firstHeldAtMs < INITIAL_DELAY_MS) return false;
  return nowMs - s.lastFireAtMs >= REPEAT_INTERVAL_MS;
}

export function afterFire(s: KeyHoldState, nowMs: number): KeyHoldState {
  return { ...s, lastFireAtMs: nowMs };
}
