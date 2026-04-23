import { describe, it, expect } from 'vitest';
import { canDuplicate, afterDup, DUP_COOLDOWN_TICKS } from './allay_follow_duplicate';

describe('allay duplicate', () => {
  it('dancing + fed + cooldown passed', () => {
    expect(
      canDuplicate(
        { lastDupTick: 0, recentlyFedAmethyst: true, danceTicksRemaining: 100 },
        DUP_COOLDOWN_TICKS,
      ),
    ).toBe(true);
  });

  it('no dance no dup', () => {
    expect(
      canDuplicate(
        { lastDupTick: 0, recentlyFedAmethyst: true, danceTicksRemaining: 0 },
        DUP_COOLDOWN_TICKS,
      ),
    ).toBe(false);
  });

  it('cooldown not passed', () => {
    expect(
      canDuplicate({ lastDupTick: 0, recentlyFedAmethyst: true, danceTicksRemaining: 100 }, 100),
    ).toBe(false);
  });

  it('after dup resets flags', () => {
    const a = afterDup(
      { lastDupTick: 0, recentlyFedAmethyst: true, danceTicksRemaining: 100 },
      500,
    );
    expect(a.recentlyFedAmethyst).toBe(false);
    expect(a.lastDupTick).toBe(500);
  });
});
