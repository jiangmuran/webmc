export const SWIPE_MIN_DISTANCE_PX = 24;
export const TAP_MAX_DURATION_MS = 200;

export interface TouchInput {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  durationMs: number;
}

export function distance(t: TouchInput): number {
  return Math.hypot(t.endX - t.startX, t.endY - t.startY);
}

export function isTap(t: TouchInput): boolean {
  return t.durationMs <= TAP_MAX_DURATION_MS && distance(t) < SWIPE_MIN_DISTANCE_PX;
}

export function isSwipe(t: TouchInput): boolean {
  return !isTap(t) && distance(t) >= SWIPE_MIN_DISTANCE_PX;
}

export function swipeDirection(t: TouchInput): 'up' | 'down' | 'left' | 'right' | undefined {
  if (!isSwipe(t)) return undefined;
  const dx = t.endX - t.startX;
  const dy = t.endY - t.startY;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}
