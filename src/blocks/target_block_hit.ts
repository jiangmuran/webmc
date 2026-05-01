// Target block hit. Wiki (minecraft.wiki/w/Target): "When struck by
// most projectiles, the target emits redstone power for 8 game ticks.
// Arrows and tridents instead cause the target to emit power for 20
// game ticks." Old SIGNAL_DURATION_TICKS = 7 was a single value below
// even the snowball window — arrows depowered ~13 ticks early, snowball
// 1 tick early.

export const RADIUS_BULLSEYE = 0.15;
export const MAX_SIGNAL = 15;
export const SIGNAL_DURATION_TICKS_ARROW = 20;
export const SIGNAL_DURATION_TICKS_THROWABLE = 8;

export type TargetProjectile = 'arrow' | 'throwable';

export function signalStrength(hitRadius: number): number {
  const inner = Math.max(0, Math.min(1, 1 - hitRadius));
  return Math.round(inner * MAX_SIGNAL);
}

export function boostsArrow(): boolean {
  return true;
}

export function signalFades(
  currentTick: number,
  hitAtTick: number,
  kind: TargetProjectile = 'arrow',
): boolean {
  const dur = kind === 'arrow' ? SIGNAL_DURATION_TICKS_ARROW : SIGNAL_DURATION_TICKS_THROWABLE;
  return currentTick - hitAtTick >= dur;
}
