// Per-frame perf metrics with rolling p50/p95/p99. Used for the
// dynamic-quality throttler and debug HUD.

export class RollingMetric {
  private samples: number[] = [];
  private capacity: number;

  constructor(capacity = 120) {
    this.capacity = capacity;
  }

  push(v: number): void {
    this.samples.push(v);
    if (this.samples.length > this.capacity) this.samples.shift();
  }

  quantile(q: number): number {
    if (this.samples.length === 0) return 0;
    const sorted = [...this.samples].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.floor(q * sorted.length));
    return sorted[idx] ?? 0;
  }

  p50(): number {
    return this.quantile(0.5);
  }
  p95(): number {
    return this.quantile(0.95);
  }
  p99(): number {
    return this.quantile(0.99);
  }

  count(): number {
    return this.samples.length;
  }

  reset(): void {
    this.samples.length = 0;
  }
}

// Thermal throttler: if p95 frame time > limit for N consecutive
// seconds, request a quality step-down.
export interface ThrottleState {
  breachStartMs: number | null;
}

export function updateThrottle(
  s: ThrottleState,
  p95FrameMs: number,
  limitMs: number,
  sustainMs: number,
  nowMs: number,
): 'ok' | 'step_down' {
  if (p95FrameMs <= limitMs) {
    s.breachStartMs = null;
    return 'ok';
  }
  s.breachStartMs ??= nowMs;
  if (nowMs - s.breachStartMs >= sustainMs) {
    s.breachStartMs = null;
    return 'step_down';
  }
  return 'ok';
}
