import { describe, it, expect } from 'vitest';
import {
  makeGoat,
  tryBeginRam,
  ramTickDone,
  hornDropsOnRam,
  CHARGE_DURATION_MS,
} from './goat_ram_charge';

describe('goat ram', () => {
  it('begins ram', () => {
    const g = makeGoat();
    expect(tryBeginRam(g, { nowMs: 1e7, targetId: 'p', rand: () => 0 })).toBe(true);
    expect(g.ramTargetId).toBe('p');
  });

  it('no target = no ram', () => {
    const g = makeGoat();
    expect(tryBeginRam(g, { nowMs: 0, targetId: null, rand: () => 0 })).toBe(false);
  });

  it('cooldown blocks', () => {
    const g = makeGoat();
    tryBeginRam(g, { nowMs: 0, targetId: 'p', rand: () => 0 });
    ramTickDone(g, CHARGE_DURATION_MS);
    expect(tryBeginRam(g, { nowMs: CHARGE_DURATION_MS + 1000, targetId: 'p', rand: () => 1 })).toBe(
      false,
    );
  });

  it('charge completes', () => {
    const g = makeGoat();
    tryBeginRam(g, { nowMs: 0, targetId: 'p', rand: () => 0 });
    expect(ramTickDone(g, CHARGE_DURATION_MS + 1)).toBe(true);
  });

  it('horn drop', () => {
    expect(hornDropsOnRam(() => 0)).toBe(true);
    expect(hornDropsOnRam(() => 0.99)).toBe(false);
  });
});
