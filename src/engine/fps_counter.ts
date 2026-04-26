// FPS counter with EMA smoothing and p95 rolling stats.
// Internally a ring buffer + running sum: was push+shift per frame
// (O(N) shift) and a fresh sort per p95 read. Now O(1) onFrame and
// allocates only when p95 is queried.

export interface FpsStats {
  samples: Float64Array;
  head: number;
  size: number;
  windowSize: number;
  emaFps: number;
  alpha: number;
  sum: number;
}

export function makeStats(windowSize = 120, alpha = 0.1): FpsStats {
  return {
    samples: new Float64Array(windowSize),
    head: 0,
    size: 0,
    windowSize,
    emaFps: 60,
    alpha,
    sum: 0,
  };
}

export function onFrame(s: FpsStats, frameMs: number): void {
  const fps = 1000 / Math.max(frameMs, 0.001);
  s.emaFps = s.alpha * fps + (1 - s.alpha) * s.emaFps;
  if (s.size === s.windowSize) {
    s.sum -= s.samples[s.head] ?? 0;
  } else {
    s.size++;
  }
  s.samples[s.head] = fps;
  s.sum += fps;
  s.head = (s.head + 1) % s.windowSize;
}

export function p95Fps(s: FpsStats): number {
  if (s.size === 0) return 0;
  const sorted = new Float64Array(s.size);
  for (let i = 0; i < s.size; i++) {
    const idx = (s.head - s.size + i + s.windowSize) % s.windowSize;
    sorted[i] = s.samples[idx] ?? 0;
  }
  sorted.sort();
  const idx = Math.floor(s.size * 0.05);
  return sorted[idx] ?? 0;
}

export function avgFps(s: FpsStats): number {
  if (s.size === 0) return 0;
  return s.sum / s.size;
}
