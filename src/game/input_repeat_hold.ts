// Input repeat-on-hold. When a hotbar slot number or chat text key is
// held down, after an initial delay (500ms) repeat at 40ms intervals.

export interface RepeatState {
  pressedAtMs: number | null;
  lastFireMs: number;
}

export const INITIAL_DELAY_MS = 500;
export const REPEAT_INTERVAL_MS = 40;

export function makeRepeat(): RepeatState {
  return { pressedAtMs: null, lastFireMs: -Infinity };
}

export function keyDown(s: RepeatState, nowMs: number): void {
  s.pressedAtMs = nowMs;
  s.lastFireMs = nowMs; // immediate first-press counts
}

export function keyUp(s: RepeatState): void {
  s.pressedAtMs = null;
}

export function shouldFireRepeat(s: RepeatState, nowMs: number): boolean {
  if (s.pressedAtMs === null) return false;
  if (nowMs - s.pressedAtMs < INITIAL_DELAY_MS) return false;
  if (nowMs - s.lastFireMs < REPEAT_INTERVAL_MS) return false;
  s.lastFireMs = nowMs;
  return true;
}
