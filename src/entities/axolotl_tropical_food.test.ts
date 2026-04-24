import { describe, it, expect } from 'vitest';
import { canFeed, grantsRegenOnAttack, playDeadDuration } from './axolotl_tropical_food';

describe('axolotl tropical food', () => {
  it('tropical fish feed ok', () => {
    expect(canFeed('tropical_fish_bucket')).toBe(true);
  });

  it('random item rejected', () => {
    expect(canFeed('cooked_beef')).toBe(false);
  });

  it('regen on attack includes regen', () => {
    expect(grantsRegenOnAttack().some((e) => e.id === 'regeneration')).toBe(true);
  });

  it('mining fatigue also granted', () => {
    expect(grantsRegenOnAttack().some((e) => e.id === 'mining_fatigue')).toBe(true);
  });

  it('play dead 200-300 ticks', () => {
    const d = playDeadDuration(() => 0.5);
    expect(d).toBeGreaterThanOrEqual(200);
    expect(d).toBeLessThanOrEqual(300);
  });
});
