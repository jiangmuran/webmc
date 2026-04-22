// Weather state machine. A world ticks through clear → rain → thunder →
// clear with MC-plausible durations (0.5..7.5 real-time minutes for clear,
// 0.5..1 min for rain, 3..13 min for thunder — we use scaled defaults).
// Pure deterministic with an injected RNG.

export type WeatherKind = 'clear' | 'rain' | 'thunder';

export interface WeatherOptions {
  clearMinSec: number;
  clearMaxSec: number;
  rainMinSec: number;
  rainMaxSec: number;
  thunderMinSec: number;
  thunderMaxSec: number;
  thunderChance: number; // probability rain → thunder rather than → clear
}

const DEFAULTS: WeatherOptions = {
  clearMinSec: 180,
  clearMaxSec: 600,
  rainMinSec: 60,
  rainMaxSec: 300,
  thunderMinSec: 30,
  thunderMaxSec: 180,
  thunderChance: 0.1,
};

export class Weather {
  private kind: WeatherKind = 'clear';
  private remainingSec: number;
  private readonly opts: WeatherOptions;
  private readonly rng: () => number;

  constructor(rng: () => number = Math.random, opts: Partial<WeatherOptions> = {}) {
    this.rng = rng;
    this.opts = { ...DEFAULTS, ...opts };
    this.remainingSec = this.pickDuration('clear');
  }

  get current(): WeatherKind {
    return this.kind;
  }

  get timeLeftSec(): number {
    return this.remainingSec;
  }

  tick(dtSec: number): WeatherKind | null {
    this.remainingSec -= dtSec;
    if (this.remainingSec > 0) return null;
    const next = this.pickNextKind();
    this.kind = next;
    this.remainingSec = this.pickDuration(next);
    return next;
  }

  force(kind: WeatherKind, durationSec?: number): void {
    this.kind = kind;
    this.remainingSec = durationSec ?? this.pickDuration(kind);
  }

  private pickNextKind(): WeatherKind {
    if (this.kind === 'clear') return 'rain';
    if (this.kind === 'rain') {
      return this.rng() < this.opts.thunderChance ? 'thunder' : 'clear';
    }
    return 'clear';
  }

  private pickDuration(k: WeatherKind): number {
    const { clearMinSec, clearMaxSec, rainMinSec, rainMaxSec, thunderMinSec, thunderMaxSec } =
      this.opts;
    const [min, max] =
      k === 'clear'
        ? [clearMinSec, clearMaxSec]
        : k === 'rain'
          ? [rainMinSec, rainMaxSec]
          : [thunderMinSec, thunderMaxSec];
    return min + this.rng() * (max - min);
  }
}
