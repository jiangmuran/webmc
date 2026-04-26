// Rolling p95 frame-time window + adaptive-quality trigger. Pure and
// deterministic: the main loop feeds dtSec each frame, the monitor reports
// the current quality level. Owns no timers, no DOM — lives in the main loop.
//
// Triggers: p95 sustained above upShiftThreshold for holdSec → drop one step.
// p95 sustained below downShiftThreshold for holdSec → raise one step.

export interface PerfMonitorOptions {
  windowSec: number; // rolling sample window
  upShiftThresholdSec: number; // above this = too slow, drop quality
  downShiftThresholdSec: number; // below this = can afford to raise
  holdSec: number; // how long the condition must persist
  minQuality: number;
  maxQuality: number;
  startQuality: number;
}

const DEFAULTS: PerfMonitorOptions = {
  windowSec: 3,
  upShiftThresholdSec: 0.033, // ~30 FPS floor
  downShiftThresholdSec: 0.022, // ~45 FPS ceiling before restoring
  holdSec: 2,
  minQuality: 2, // view distance
  maxQuality: 12,
  startQuality: 8,
};

export class PerfMonitor {
  private readonly opts: PerfMonitorOptions;
  // Ring buffer over a fixed window so we never shift() — shift on a
  // 200-element array runs O(N) per frame, plus the per-frame
  // [...samples].sort() is O(N log N) — together ~2K ops/frame just to
  // know the p95 frame time. Replaced with O(1) push and an O(N log N)
  // sort that runs only when we actually need a fresh p95 (every
  // re-evaluation, throttled to 4 Hz).
  private readonly samples: number[] = [];
  private readonly times: number[] = [];
  private head = 0;
  private size = 0;
  private cap: number;
  private sortScratch: Float64Array;
  private _quality: number;
  private _cumulativeSec = 0;
  private conditionStartSec: number | null = null;
  private conditionKind: 'up' | 'down' | null = null;
  private p95Cache = 0;
  private p95CacheAt = -Infinity;
  private static readonly P95_REFRESH_SEC = 0.25;

  constructor(opts: Partial<PerfMonitorOptions> = {}) {
    this.opts = { ...DEFAULTS, ...opts };
    this._quality = this.opts.startQuality;
    // Cap = window/expected-frame-time, with 2x headroom for slow devices.
    // 240 samples at 60fps = 4s of samples — covers 3s window + 33% slack.
    this.cap = Math.max(60, Math.ceil(this.opts.windowSec * 120));
    this.samples = new Array<number>(this.cap).fill(0);
    this.times = new Array<number>(this.cap).fill(0);
    this.sortScratch = new Float64Array(this.cap);
  }

  get quality(): number {
    return this._quality;
  }

  p95(): number {
    if (this.size === 0) return 0;
    // Cached p95 — fresh enough most frames (we only need quality decisions
    // at human-perceptible cadence, not per-frame).
    if (this._cumulativeSec - this.p95CacheAt < PerfMonitor.P95_REFRESH_SEC) {
      return this.p95Cache;
    }
    // Evict aged-out samples first so they don't enter the sort.
    while (this.size > 0) {
      const oldestIdx = (this.head - this.size + this.cap) % this.cap;
      const oldestT = this.times[oldestIdx] ?? 0;
      if (this._cumulativeSec - oldestT > this.opts.windowSec) {
        this.size--;
      } else break;
    }
    if (this.size === 0) return 0;
    for (let i = 0; i < this.size; i++) {
      const idx = (this.head - this.size + i + this.cap) % this.cap;
      this.sortScratch[i] = this.samples[idx] ?? 0;
    }
    // Subarray view + in-place sort: avoids allocating a fresh sorted copy.
    const view = this.sortScratch.subarray(0, this.size);
    view.sort();
    const idx = Math.min(this.size - 1, Math.floor(this.size * 0.95));
    this.p95Cache = view[idx] ?? 0;
    this.p95CacheAt = this._cumulativeSec;
    return this.p95Cache;
  }

  tick(dtSec: number): boolean {
    this._cumulativeSec += dtSec;
    this.samples[this.head] = dtSec;
    this.times[this.head] = this._cumulativeSec;
    this.head = (this.head + 1) % this.cap;
    if (this.size < this.cap) this.size++;
    const p = this.p95();
    return this.evaluate(p);
  }

  private evaluate(p: number): boolean {
    const nowKind: 'up' | 'down' | null =
      p > this.opts.upShiftThresholdSec
        ? 'up'
        : p > 0 && p < this.opts.downShiftThresholdSec
          ? 'down'
          : null;
    if (nowKind !== this.conditionKind) {
      this.conditionKind = nowKind;
      this.conditionStartSec = nowKind === null ? null : this._cumulativeSec;
      return false;
    }
    if (nowKind === null || this.conditionStartSec === null) return false;
    if (this._cumulativeSec - this.conditionStartSec < this.opts.holdSec) return false;
    if (nowKind === 'up' && this._quality > this.opts.minQuality) {
      this._quality--;
      this.conditionStartSec = this._cumulativeSec;
      return true;
    }
    if (nowKind === 'down' && this._quality < this.opts.maxQuality) {
      this._quality++;
      this.conditionStartSec = this._cumulativeSec;
      return true;
    }
    return false;
  }

  reset(): void {
    this.samples.fill(0);
    this.times.fill(0);
    this.head = 0;
    this.size = 0;
    this._cumulativeSec = 0;
    this.conditionStartSec = null;
    this.conditionKind = null;
    this.p95Cache = 0;
    this.p95CacheAt = -Infinity;
  }
}
