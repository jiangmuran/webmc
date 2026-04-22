import { describe, it, expect } from 'vitest';
import { makeVillager, maybeZombify, startCure, tickCure } from './villager_zombify';

describe('villager zombification', () => {
  it('never zombifies on easy', () => {
    const v = makeVillager();
    const r = maybeZombify(v, { difficulty: 'easy', rng: () => 0 });
    expect(r.converted).toBe(false);
  });

  it('always zombifies on hard', () => {
    const v = makeVillager();
    const r = maybeZombify(v, { difficulty: 'hard', rng: () => 0.99 });
    expect(r.converted).toBe(true);
  });

  it('50% on normal', () => {
    let conv = 0;
    for (let i = 0; i < 1000; i++) {
      const v = makeVillager();
      const r = maybeZombify(v, { difficulty: 'normal', rng: Math.random });
      if (r.converted) conv++;
    }
    expect(conv).toBeGreaterThan(400);
    expect(conv).toBeLessThan(600);
  });

  it('cure finishes after total time', () => {
    const v = makeVillager();
    maybeZombify(v, { difficulty: 'hard', rng: () => 0 });
    startCure(v, () => 0); // 180s
    for (let i = 0; i < 200; i++) tickCure(v, 1);
    expect(v.zombified).toBe(false);
    expect(v.curing).toBeNull();
  });

  it('cure refuses on non-zombified villager', () => {
    const v = makeVillager();
    expect(startCure(v)).toBe(false);
  });
});
