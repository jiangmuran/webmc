export const BASE_DRAW_TICKS = 25;
export const REDUCTION_PER_LEVEL = 5;
export const MAX_LEVEL = 5;

export function drawTime(level: number): number {
  const l = Math.max(0, Math.min(MAX_LEVEL, level));
  return Math.max(1, BASE_DRAW_TICKS - l * REDUCTION_PER_LEVEL);
}

export function isReady(heldTicks: number, level: number): boolean {
  return heldTicks >= drawTime(level);
}
