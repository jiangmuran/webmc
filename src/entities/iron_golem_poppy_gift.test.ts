import { describe, it, expect } from 'vitest';
import { shouldGiveRose, itemOffered, GIFT_INTERVAL_MAX } from './iron_golem_poppy_gift';

describe('iron golem poppy gift', () => {
  it('no villagers no gift', () => {
    expect(shouldGiveRose({ ticksSinceLastGift: 99999, hasVillagers: false }, () => 0)).toBe(false);
  });

  it('long gap + lucky rng gifts', () => {
    expect(
      shouldGiveRose({ ticksSinceLastGift: GIFT_INTERVAL_MAX, hasVillagers: true }, () => 0),
    ).toBe(true);
  });

  it('short gap no gift', () => {
    expect(shouldGiveRose({ ticksSinceLastGift: 10, hasVillagers: true }, () => 0.99)).toBe(false);
  });

  it('gift is poppy', () => {
    expect(itemOffered()).toBe('poppy');
  });
});
