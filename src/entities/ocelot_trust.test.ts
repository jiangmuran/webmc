import { describe, it, expect } from 'vitest';
import { feedOcelot, isTrusting, makeOcelot } from './ocelot_trust';

describe('ocelot trust', () => {
  it('feeding raw fish increases trust', () => {
    const o = makeOcelot();
    feedOcelot(o, { playerId: 1, itemName: 'webmc:raw_fish', rng: () => 0.01 });
    expect(o.trustLevel).toBe(25);
  });

  it('reaches trusting at 75+', () => {
    const o = makeOcelot();
    for (let i = 0; i < 10; i++) {
      feedOcelot(o, { playerId: 1, itemName: 'webmc:raw_fish', rng: () => 0.01 });
    }
    expect(isTrusting(o)).toBe(true);
  });

  it('wrong item → no trust change', () => {
    const o = makeOcelot();
    const r = feedOcelot(o, {
      playerId: 1,
      itemName: 'webmc:stone',
      rng: () => 0,
    });
    expect(r.itemConsumed).toBe(false);
  });

  it('different player cannot feed trusted ocelot', () => {
    const o = makeOcelot();
    feedOcelot(o, { playerId: 1, itemName: 'webmc:raw_fish', rng: () => 0.01 });
    const r = feedOcelot(o, { playerId: 2, itemName: 'webmc:raw_fish', rng: () => 0.01 });
    expect(r.itemConsumed).toBe(false);
  });
});
