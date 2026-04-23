import { describe, it, expect } from 'vitest';
import {
  linearFade,
  equalPowerFadeIn,
  equalPowerFadeOut,
  tickCrossfade,
  crossfadeGains,
  crossfadeDone,
} from './audio_fade';

describe('audio fade', () => {
  it('linear clamps', () => {
    expect(linearFade(-1)).toBe(0);
    expect(linearFade(2)).toBe(1);
    expect(linearFade(0.5)).toBe(0.5);
  });

  it('equal-power fade-in endpoints', () => {
    expect(equalPowerFadeIn(0)).toBeCloseTo(0);
    expect(equalPowerFadeIn(1)).toBeCloseTo(1);
  });

  it('equal-power fade-out endpoints', () => {
    expect(equalPowerFadeOut(0)).toBeCloseTo(1);
    expect(equalPowerFadeOut(1)).toBeCloseTo(0);
  });

  it('crossfade sum of squares ~1', () => {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const a = equalPowerFadeIn(t);
      const b = equalPowerFadeOut(t);
      expect(a * a + b * b).toBeCloseTo(1);
    }
  });

  it('tick advances', () => {
    const c = tickCrossfade({ durationMs: 1000, elapsedMs: 0 }, 250);
    expect(c.elapsedMs).toBe(250);
  });

  it('done after duration', () => {
    expect(crossfadeDone({ durationMs: 1000, elapsedMs: 1000 })).toBe(true);
  });

  it('gains at midway', () => {
    const g = crossfadeGains({ durationMs: 1000, elapsedMs: 500 });
    expect(g.from).toBeCloseTo(g.to);
  });
});
