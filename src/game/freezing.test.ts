import { describe, it, expect } from 'vitest';
import { makeFreezingState, tickFreezing } from './freezing';

describe('freezing', () => {
  it('builds up in powder snow without armor', () => {
    const s = makeFreezingState();
    for (let i = 0; i < 80; i++) {
      tickFreezing(s, 0.1, { inPowderSnow: true, leatherArmorCount: 0 });
    }
    expect(s.ticks).toBeGreaterThan(100);
  });

  it('full leather stops the freeze', () => {
    const s = makeFreezingState();
    for (let i = 0; i < 80; i++) {
      tickFreezing(s, 0.1, { inPowderSnow: true, leatherArmorCount: 4 });
    }
    expect(s.ticks).toBe(0);
  });

  it('thaws when out of snow', () => {
    const s = makeFreezingState();
    s.ticks = 100;
    for (let i = 0; i < 40; i++) {
      tickFreezing(s, 0.1, { inPowderSnow: false, leatherArmorCount: 0 });
    }
    expect(s.ticks).toBe(0);
  });

  it('damages once fully frozen on cooldown', () => {
    const s = makeFreezingState();
    s.ticks = 140;
    let totalDamage = 0;
    for (let i = 0; i < 60; i++) {
      totalDamage += tickFreezing(s, 0.1, {
        inPowderSnow: true,
        leatherArmorCount: 0,
      }).damage;
    }
    expect(totalDamage).toBeGreaterThan(0);
  });
});
