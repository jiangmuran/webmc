// Damage red-tint flash. After taking damage, overlay a red tint that
// fades over ~10 ticks. Strong hits flash more intensely.

export const DAMAGE_TINT_DURATION_TICKS = 10;

export interface TintState {
  ticksRemaining: number;
  peakIntensity: number;
}

export function onDamaged(damage: number): TintState {
  const peak = Math.min(1, damage / 10);
  return { ticksRemaining: DAMAGE_TINT_DURATION_TICKS, peakIntensity: peak };
}

export function tick(t: TintState): TintState {
  return { ...t, ticksRemaining: Math.max(0, t.ticksRemaining - 1) };
}

export function currentAlpha(t: TintState): number {
  if (t.ticksRemaining <= 0) return 0;
  const progress = t.ticksRemaining / DAMAGE_TINT_DURATION_TICKS;
  return t.peakIntensity * progress;
}
