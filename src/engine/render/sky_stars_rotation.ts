export const STAR_COUNT = 1500;
export const STAR_VISIBLE_DAYTIME_FACTOR = 0;
export const STAR_VISIBLE_NIGHT_FACTOR = 1;

export function starAlphaForTime(timeOfDay: number): number {
  const t = ((timeOfDay % 24000) + 24000) % 24000;
  const day = t < 13000 || t >= 23000;
  if (day) return 0;
  const mid = 18000;
  const dist = Math.abs(t - mid);
  return Math.max(0, 1 - dist / 5000);
}

export function skyAngleForTime(timeOfDay: number): number {
  return ((timeOfDay % 24000) / 24000) * Math.PI * 2;
}
