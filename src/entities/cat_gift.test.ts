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

  it('gift list excludes raw_fish and raw_salmon (wiki: not in cat_morning_gift loot table)', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const r = rollCatGift({ ownerSleptNearby: true, rng: Math.random });
      if (r.gift) seen.add(r.gift);
    }
    expect(seen.has('webmc:raw_fish' as never)).toBe(false);
    expect(seen.has('webmc:raw_salmon' as never)).toBe(false);
    // The 7 wiki-canonical items should appear.
    expect(seen.has('webmc:rabbit_foot')).toBe(true);
    expect(seen.has('webmc:string')).toBe(true);
    expect(seen.has('webmc:feather')).toBe(true);
  });

  it('phantom membrane is the rare drop (wiki: 1/31 = 3.22%)', () => {
    let phantomCount = 0;
    let stringCount = 0;
    for (let i = 0; i < 5000; i++) {
      const r = rollCatGift({ ownerSleptNearby: true, rng: Math.random });
      if (r.gift === 'webmc:phantom_membrane') phantomCount++;
      if (r.gift === 'webmc:string') stringCount++;
    }
    expect(stringCount).toBeGreaterThan(phantomCount * 2); // ~5× rarer
  });
});
