// Server TPS monitor. Tracks tick-to-tick wall clock duration over a
// rolling window and exposes TPS (target 20) and mean/max tick-time.
// Used for the F3 debug overlay and to gate auto-lag responses like
// dropping random-tick speed.

export interface TpsMonitorOptions {
  windowTicks: number;
  targetTps: number;
}

export class TpsMonitor {
  private readonly window: number[] = [];
  private readonly max: number;
  private readonly target: number;

  constructor(opts: TpsMonitorOptions = { windowTicks: 100, targetTps: 20 }) {
    this.max = opts.windowTicks;
    this.target = opts.targetTps;
  }

  observeTick(dtMs: number): void {
    this.window.push(dtMs);
    if (this.window.length > this.max) this.window.shift();
  }

  get currentTps(): number {
    if (this.window.length === 0) return this.target;
    const mean = this.window.reduce((s, v) => s + v, 0) / this.window.length;
    if (mean <= 0) return this.target;
    return Math.min(this.target, 1000 / mean);
  }

  get meanTickMs(): number {
    if (this.window.length === 0) return 1000 / this.target;
    return this.window.reduce((s, v) => s + v, 0) / this.window.length;
  }

  get p95TickMs(): number {
    if (this.window.length === 0) return 0;
    const sorted = [...this.window].sort((a, b) => a - b);
    const idx = Math.floor(sorted.length * 0.95);
    return sorted[Math.min(sorted.length - 1, idx)] ?? 0;
  }

  get lagging(): boolean {
    return this.currentTps < this.target * 0.9;
  }

  reset(): void {
    this.window.length = 0;
  }
}

// Simple auto-response: if server is lagging, reduce random tick speed.
export interface LagResponseQuery {
  currentTps: number;
  targetTps: number;
  currentRandomTickSpeed: number;
}

export function suggestedRandomTickSpeed(q: LagResponseQuery): number {
  const ratio = q.currentTps / q.targetTps;
  if (ratio >= 0.95) return q.currentRandomTickSpeed;
  if (ratio < 0.5) return Math.max(1, Math.floor(q.currentRandomTickSpeed / 3));
  return Math.max(1, Math.floor(q.currentRandomTickSpeed * ratio));
}
