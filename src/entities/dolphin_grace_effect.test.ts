import { describe, it, expect } from 'vitest';
import { hasGrace, swimMultiplier, GRACE_DURATION } from './dolphin_grace_effect';

describe('dolphin grace effect', () => {
  it('in grace fast', () => {
    expect(swimMultiplier({ ticksSinceLastDolphinTouch: 50 })).toBeGreaterThan(1);
  });

  it('out of grace normal', () => {
    expect(swimMultiplier({ ticksSinceLastDolphinTouch: GRACE_DURATION })).toBe(1);
  });

  it('grace flag', () => {
    expect(hasGrace({ ticksSinceLastDolphinTouch: 0 })).toBe(true);
    expect(hasGrace({ ticksSinceLastDolphinTouch: 999 })).toBe(false);
  });
});
