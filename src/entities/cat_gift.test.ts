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

  it('unlucky roll no gift', () => {
    expect(rollCatGift({ ownerSleptNearby: true, rng: () => 0.5 }).givesGift).toBe(false);
  });
});
