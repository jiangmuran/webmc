export const TINT_DURATION_TICKS = 10;

export function redTintAlpha(ticksSinceHit: number): number {
  if (ticksSinceHit < 0) return 0;
  if (ticksSinceHit >= TINT_DURATION_TICKS) return 0;
  return 1 - ticksSinceHit / TINT_DURATION_TICKS;
}

export function tintColor(ticksSinceHit: number): [number, number, number, number] {
  return [1, 0, 0, redTintAlpha(ticksSinceHit) * 0.5];
}
