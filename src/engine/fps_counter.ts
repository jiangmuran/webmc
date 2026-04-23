// FPS counter with EMA smoothing and p95 rolling stats.

export interface FpsStats {
  samples: number[];
  windowSize: number;
  emaFps: number;
  alpha: number;
}

export function makeStats(windowSize = 120, alpha = 0.1): FpsStats {
  return { samples: [], windowSize, emaFps: 60, alpha };
}

export function onFrame(s: FpsStats, frameMs: number): void {
  const fps = 1000 / Math.max(frameMs, 0.001);
  s.emaFps = s.alpha * fps + (1 - s.alpha) * s.emaFps;
  s.samples.push(fps);
  if (s.samples.length > s.windowSize) s.samples.shift();
}

export function p95Fps(s: FpsStats): number {
  if (s.samples.length === 0) return 0;
  const sorted = [...s.samples].sort((a, b) => a - b);
  const idx = Math.floor(sorted.length * 0.05);
  return sorted[idx] ?? 0;
}

export function avgFps(s: FpsStats): number {
  if (s.samples.length === 0) return 0;
  return s.samples.reduce((a, b) => a + b, 0) / s.samples.length;
}
