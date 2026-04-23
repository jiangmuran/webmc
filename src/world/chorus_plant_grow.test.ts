import { describe, it, expect } from 'vitest';
import {
  tryGrowUp,
  branchCountForHeight,
  breakPropagates,
  CHORUS_MAX_HEIGHT,
} from './chorus_plant_grow';

describe('chorus plant grow', () => {
  it('grows upward', () => {
    const r = tryGrowUp({ height: 1, isFlower: false, branchCount: 0 }, () => 0.9);
    expect(r.height).toBe(2);
  });

  it('caps at max', () => {
    const r = tryGrowUp({ height: CHORUS_MAX_HEIGHT, isFlower: false, branchCount: 0 }, () => 0.9);
    expect(r.isFlower).toBe(true);
  });

  it('flower terminates', () => {
    const r = tryGrowUp({ height: 1, isFlower: true, branchCount: 0 }, () => 0);
    expect(r.isFlower).toBe(true);
  });

  it('branch count 0..4', () => {
    for (let i = 0; i < 20; i++) {
      const c = branchCountForHeight(1, Math.random);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(4);
    }
  });

  it('break propagates', () => {
    expect(breakPropagates()).toBe(true);
  });
});
