import { describe, it, expect } from 'vitest';
import { rollCatGift } from './cat_gift';

describe('cat gift', () => {
  it('owner not nearby → no gift', () => {
    expect(rollCatGift({ ownerSleptNearby: false, rng: () => 0 }).givesGift).toBe(false);
  });

  it('lucky roll gives a gift', () => {
    const r = rollCatGift({ ownerSleptNearby: true, rng: () => 0 });
    expect(r.givesGift).toBe(true);
    expect(r.gift).not.toBeNull();
  });

  it('roll within 70% gives gift (wiki)', () => {
    expect(rollCatGift({ ownerSleptNearby: true, rng: () => 0.5 }).givesGift).toBe(true);
  });

  it('roll above 70% no gift (wiki: 70% chance)', () => {
    expect(rollCatGift({ ownerSleptNearby: true, rng: () => 0.8 }).givesGift).toBe(false);
  });
});
