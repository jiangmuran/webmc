import { describe, it, expect } from 'vitest';
import { rollWanderingTraderOffers } from './wandering_trader';

const ids = new Map<string, number>();
[
  'webmc:emerald',
  'webmc:acacia_sapling',
  'webmc:bamboo',
  'webmc:cactus',
  'webmc:dandelion',
  'webmc:blue_orchid',
  'webmc:lily_pad',
  'webmc:pumpkin',
  'webmc:melon_seeds',
  'webmc:sweet_berries',
  'webmc:sand',
  'webmc:kelp',
  'webmc:podzol',
  'webmc:packed_ice',
  'webmc:blue_ice',
].forEach((n, i) => ids.set(n, i + 1));

describe('wandering trader', () => {
  it('rolls 6 offers (5 common + 1 rare)', () => {
    const offers = rollWanderingTraderOffers(Math.random, (n) => ids.get(n));
    expect(offers.length).toBe(6);
    for (const o of offers) expect(o.maxUses).toBe(1);
  });

  it('each offer has 1 input + output', () => {
    const offers = rollWanderingTraderOffers(Math.random, (n) => ids.get(n));
    for (const o of offers) {
      expect(o.input.length).toBe(1);
      expect(o.output.itemId).toBeGreaterThan(0);
    }
  });

  it("unresolved item names don't crash (default to 0)", () => {
    const offers = rollWanderingTraderOffers(Math.random, () => undefined);
    expect(offers.length).toBeGreaterThan(0);
    for (const o of offers) expect(o.output.itemId).toBe(0);
  });
});
