// Server TPS (ticks per second) tracker. Report MSPT (ms per tick)
// rolling p50/p95. Used for /tps command.

export class TpsTracker {
  // Ring buffer over fixed capacity. shift() per frame was O(N) (cap*60
  // ops/sec for nothing); ring writes are O(1).
  private readonly samples: Float64Array;
  // Reused scratch for percentile() — was a fresh Float64Array(size)
  // per call. Allocate once at capacity so the /tps command doesn't
  // pay GC churn for repeat reads.
  private readonly sortScratch: Float64Array;
  private head = 0;
  private size = 0;
  private capacity: number;
  private sum = 0;

  constructor(capacity = 100) {
    this.capacity = capacity;
    this.samples = new Float64Array(capacity);
    this.sortScratch = new Float64Array(capacity);
  }

  pushMspt(ms: number): void {
    if (this.size === this.capacity) {
      this.sum -= this.samples[this.head] ?? 0;
    } else {
      this.size++;
    }
    this.samples[this.head] = ms;
    this.sum += ms;
    this.head = (this.head + 1) % this.capacity;
  }

  tps(): number {
    if (this.size === 0) return 20;
    const avg = this.sum / this.size;
    if (avg <= 0) return 20;
    return Math.min(20, 1000 / avg);
  }

  percentile(q: number): number {
    if (this.size === 0) return 0;
    for (let i = 0; i < this.size; i++) {
      const idx = (this.head - this.size + i + this.capacity) % this.capacity;
      this.sortScratch[i] = this.samples[idx] ?? 0;
    }
    // In-place sort on a size-prefixed view; no allocation.
    const view = this.sortScratch.subarray(0, this.size);
    view.sort();
    const idx = Math.min(this.size - 1, Math.floor(q * this.size));
    return view[idx] ?? 0;
  }

  isLagging(): boolean {
    return this.tps() < 18;
  }
}
