export const MIN_DELAY = 1;
export const MAX_DELAY = 4;

export function delayTicks(setting: number): number {
  const s = Math.max(MIN_DELAY, Math.min(MAX_DELAY, setting));
  return s * 2;
}

export function cycleNextDelay(current: number): number {
  const next = current + 1;
  return next > MAX_DELAY ? MIN_DELAY : next;
}
