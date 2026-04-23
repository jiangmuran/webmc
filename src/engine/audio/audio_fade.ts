// Audio fade curves. Linear and equal-power for crossfades.

export function linearFade(t: number): number {
  return Math.max(0, Math.min(1, t));
}

export function equalPowerFadeIn(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return Math.sin((c * Math.PI) / 2);
}

export function equalPowerFadeOut(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return Math.cos((c * Math.PI) / 2);
}

export interface Crossfade {
  durationMs: number;
  elapsedMs: number;
}

export function tickCrossfade(c: Crossfade, dtMs: number): Crossfade {
  return { ...c, elapsedMs: Math.min(c.durationMs, c.elapsedMs + dtMs) };
}

export function crossfadeGains(c: Crossfade): { from: number; to: number } {
  const t = c.durationMs > 0 ? c.elapsedMs / c.durationMs : 1;
  return { from: equalPowerFadeOut(t), to: equalPowerFadeIn(t) };
}

export function crossfadeDone(c: Crossfade): boolean {
  return c.elapsedMs >= c.durationMs;
}
