// Target block. Emits redstone signal 0..15 based on the projectile's
// hit distance from center of the face.

export const TARGET_PULSE_TICKS = 8;

export function signalStrengthFromDistance(centerDistance: number, faceRadius: number): number {
  if (centerDistance >= faceRadius) return 1;
  if (centerDistance <= 0) return 15;
  const t = 1 - centerDistance / faceRadius;
  return Math.max(1, Math.min(15, Math.ceil(15 * t)));
}

export interface TargetState {
  emittingUntilTick: number;
  currentStrength: number;
}

export function onHit(nowTick: number, strength: number): TargetState {
  return { emittingUntilTick: nowTick + TARGET_PULSE_TICKS, currentStrength: strength };
}

export function currentOutput(s: TargetState, nowTick: number): number {
  return nowTick < s.emittingUntilTick ? s.currentStrength : 0;
}

export function affectedByArrow(): boolean {
  return true;
}

export function affectedBySnowball(): boolean {
  return true;
}
