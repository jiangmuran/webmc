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
  private readonly samples: number[] = []; // dtSec per frame, oldest first
  private readonly times: number[] = []; // timestamp per frame, parallel array
  private _quality: number;
  private _cumulativeSec = 0;
  private conditionStartSec: number | null = null;
  private conditionKind: 'up' | 'down' | null = null;

  constructor(opts: Partial<PerfMonitorOptions> = {}) {
    this.opts = { ...DEFAULTS, ...opts };
    this._quality = this.opts.startQuality;
  }

  get quality(): number {
    return this._quality;
  }

  // Returns the current p95 frame time; the 95th percentile of recorded
  // samples, or 0 if none.
  p95(): number {
    if (this.samples.length === 0) return 0;
    const sorted = [...this.samples].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
    return sorted[idx] ?? 0;
  }

  // Feed one frame. dtSec = actual frame time. Returns true if quality changed.
  tick(dtSec: number): boolean {
    this._cumulativeSec += dtSec;
    this.samples.push(dtSec);
    this.times.push(this._cumulativeSec);
    // Drop samples older than windowSec.
    while (
      this.times.length > 0 &&
      this._cumulativeSec - (this.times[0] ?? 0) > this.opts.windowSec
    ) {
      this.samples.shift();
      this.times.shift();
    }
    const p = this.p95();
    const changed = this.evaluate(p);
    return changed;
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
    this.samples.length = 0;
    this.times.length = 0;
    this._cumulativeSec = 0;
    this.conditionStartSec = null;
    this.conditionKind = null;
  }
}
