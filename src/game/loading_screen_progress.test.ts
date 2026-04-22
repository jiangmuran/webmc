import { describe, it, expect } from 'vitest';
import { overallProgress, isReady } from './loading_screen_progress';

describe('loading screen progress', () => {
  it('init 0 → small fraction', () => {
    expect(overallProgress('init', 0)).toBe(0);
  });

  it('init complete', () => {
    expect(overallProgress('init', 1)).toBeCloseTo(0.05);
  });

  it('terrain half', () => {
    const p = overallProgress('terrain', 0.5);
    expect(p).toBeGreaterThan(0.05 + 0.15);
    expect(p).toBeLessThan(1);
  });

  it('ready complete = 1', () => {
    expect(overallProgress('ready', 1)).toBeCloseTo(1);
  });

  it('isReady', () => {
    expect(isReady('ready')).toBe(true);
    expect(isReady('terrain')).toBe(false);
  });
});
