// Server TPS (ticks per second) tracker. Report MSPT (ms per tick)
// rolling p50/p95. Used for /tps command.

export class TpsTracker {
  private samples: number[] = [];
  private capacity: number;

  constructor(capacity = 100) {
    this.capacity = capacity;
  }

  pushMspt(ms: number): void {
    this.samples.push(ms);
    if (this.samples.length > this.capacity) this.samples.shift();
  }

  tps(): number {
    if (this.samples.length === 0) return 20;
    const avg = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
    if (avg <= 0) return 20;
    return Math.min(20, 1000 / avg);
  }

  percentile(q: number): number {
    if (this.samples.length === 0) return 0;
    const sorted = [...this.samples].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.floor(q * sorted.length));
    return sorted[idx] ?? 0;
  }

  isLagging(): boolean {
    return this.tps() < 18;
  }
}
