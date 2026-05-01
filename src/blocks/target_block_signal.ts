// Target block. Emits redstone signal 0..15 based on the projectile's
// hit distance from center of the face. Wiki (minecraft.wiki/w/Target):
// "When struck by most projectiles, the target emits redstone power for
// 8 game ticks. Arrows and tridents instead cause the target to emit
// power for 20 game ticks." Old constant TARGET_PULSE_TICKS = 8
// universal — half-correct: snowball/egg used the right window, but
// arrows depowered 12 ticks early.

export const PULSE_TICKS_ARROW = 20;
export const PULSE_TICKS_THROWABLE = 8;

export type TargetProjectile = 'arrow' | 'throwable';

export function pulseTicksFor(kind: TargetProjectile): number {
  return kind === 'arrow' ? PULSE_TICKS_ARROW : PULSE_TICKS_THROWABLE;
}

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

export function onHit(
  nowTick: number,
  strength: number,
  kind: TargetProjectile = 'arrow',
): TargetState {
  return { emittingUntilTick: nowTick + pulseTicksFor(kind), currentStrength: strength };
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
