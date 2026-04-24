export const DOUBLE_TAP_WINDOW_MS = 300;

export interface DoubleTapState {
  lastTapMs: number;
}

export function onTap(
  s: DoubleTapState,
  nowMs: number,
): { state: DoubleTapState; isDouble: boolean } {
  if (nowMs - s.lastTapMs <= DOUBLE_TAP_WINDOW_MS) {
    return { state: { lastTapMs: 0 }, isDouble: true };
  }
  return { state: { lastTapMs: nowMs }, isDouble: false };
}

export function sprintFromDoubleTap(isDouble: boolean): boolean {
  return isDouble;
}
