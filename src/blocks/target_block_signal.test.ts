import { describe, it, expect } from 'vitest';
import {
  signalStrengthFromDistance,
  onHit,
  currentOutput,
  affectedByArrow,
  affectedBySnowball,
} from './target_block_signal';

describe('target block signal', () => {
  it('center = 15', () => {
    expect(signalStrengthFromDistance(0, 1)).toBe(15);
  });

  it('edge = 1', () => {
    expect(signalStrengthFromDistance(1, 1)).toBe(1);
  });

  it('mid is in between', () => {
    const mid = signalStrengthFromDistance(0.5, 1);
    expect(mid).toBeGreaterThan(1);
    expect(mid).toBeLessThan(15);
  });

  it('pulse decays', () => {
    const s = onHit(0, 10);
    expect(currentOutput(s, 0)).toBe(10);
    expect(currentOutput(s, 100)).toBe(0);
  });

  it('accepts arrows + snowballs', () => {
    expect(affectedByArrow()).toBe(true);
    expect(affectedBySnowball()).toBe(true);
  });
});
