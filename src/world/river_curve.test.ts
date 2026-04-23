import { describe, it, expect } from 'vitest';
import {
  riverDepressionAt,
  isRiver,
  depressionDepth,
  RIVER_DEPRESSION_MAX_DEPTH,
} from './river_curve';

describe('river curve', () => {
  it('far from river = 0', () => {
    expect(riverDepressionAt(0, 1000, 1)).toBe(0);
  });

  it('isRiver near axis', () => {
    for (let x = 0; x < 100; x++) {
      const line = Math.sin(x * 0.01) * 50;
      if (isRiver(x, line, 0)) return;
    }
    throw new Error('no river found');
  });

  it('depth scales', () => {
    expect(depressionDepth(1)).toBe(RIVER_DEPRESSION_MAX_DEPTH);
    expect(depressionDepth(0)).toBe(0);
  });
});
