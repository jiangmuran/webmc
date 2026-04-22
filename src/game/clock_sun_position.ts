// Clock item: sun/moon angle HUD. World time 0 = dawn; sun makes one
// full 360° circuit every 24000 ticks.

export const DAY_TICKS = 24000;

export function sunAngleRadians(worldTick: number): number {
  const t = ((worldTick % DAY_TICKS) + DAY_TICKS) % DAY_TICKS;
  return (t / DAY_TICKS) * 2 * Math.PI;
}

export function moonAngleRadians(worldTick: number): number {
  return sunAngleRadians(worldTick) + Math.PI;
}

// Clock item image index (0..63) used in UI.
export const CLOCK_FRAMES = 64;

export function clockFrameIndex(worldTick: number): number {
  return Math.floor((sunAngleRadians(worldTick) / (2 * Math.PI)) * CLOCK_FRAMES) % CLOCK_FRAMES;
}

export function isDay(worldTick: number): boolean {
  const t = ((worldTick % DAY_TICKS) + DAY_TICKS) % DAY_TICKS;
  return t < 12000;
}
