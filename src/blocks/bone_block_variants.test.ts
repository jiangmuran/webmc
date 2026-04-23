import { describe, it, expect } from 'vitest';
import { placedAxisFromFace, dropsBoneMeal, noteBlockInstrument } from './bone_block_variants';

describe('bone block variants', () => {
  it('up face y', () => {
    expect(placedAxisFromFace('up')).toBe('y');
  });

  it('east face x', () => {
    expect(placedAxisFromFace('east')).toBe('x');
  });

  it('bone meal drops 1-3', () => {
    const n = dropsBoneMeal(() => 0.5);
    expect(n).toBeGreaterThanOrEqual(1);
    expect(n).toBeLessThanOrEqual(3);
  });

  it('xylophone instrument', () => {
    expect(noteBlockInstrument()).toBe('xylophone');
  });
});
