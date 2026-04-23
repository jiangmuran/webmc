export function bobAmount(speed: number, enabled: boolean): number {
  if (!enabled) return 0;
  const s = Math.min(1, speed);
  return s * 0.08;
}

export function bobY(tick: number, speed: number, enabled: boolean): number {
  const amp = bobAmount(speed, enabled);
  return Math.sin(tick * 0.5) * amp;
}
