// Animated world border resize.

export interface BorderAnim {
  fromRadius: number;
  toRadius: number;
  startMs: number;
  durationMs: number;
}

export function radiusAt(a: BorderAnim, nowMs: number): number {
  if (a.durationMs <= 0) return a.toRadius;
  const t = Math.max(0, Math.min(1, (nowMs - a.startMs) / a.durationMs));
  return a.fromRadius + (a.toRadius - a.fromRadius) * t;
}

export function isFinished(a: BorderAnim, nowMs: number): boolean {
  return nowMs - a.startMs >= a.durationMs;
}

export function damagePerBlockOutside(): number {
  return 0.2;
}

export function isOutside(
  pos: { x: number; z: number },
  radius: number,
  center: { x: number; z: number },
): boolean {
  const dx = Math.abs(pos.x - center.x);
  const dz = Math.abs(pos.z - center.z);
  return Math.max(dx, dz) > radius;
}
