import { describe, it, expect } from 'vitest';
import {
  makeWitch,
  tryThrow,
  pickDefense,
  startDrink,
  isDrinking,
  THROW_COOLDOWN_MS,
  DRINK_DURATION_MS,
} from './witch_potion_throw';

describe('witch', () => {
  it('throws when ready', () => {
    const w = makeWitch();
    expect(tryThrow(w, { nowMs: 0, targetInRange: true, rand: () => 0 })).toBe('poison');
  });

  it('respects cooldown', () => {
    const w = makeWitch();
    tryThrow(w, { nowMs: 0, targetInRange: true, rand: () => 0 });
    expect(tryThrow(w, { nowMs: 1000, targetInRange: true, rand: () => 0 })).toBeNull();
  });

  it('after cooldown ok', () => {
    const w = makeWitch();
    tryThrow(w, { nowMs: 0, targetInRange: true, rand: () => 0 });
    expect(
      tryThrow(w, { nowMs: THROW_COOLDOWN_MS + 1, targetInRange: true, rand: () => 0.9 }),
    ).toBe('harming');
  });

  it('low hp picks healing', () => {
    const w = makeWitch();
    expect(
      pickDefense(w, {
        nowMs: 0,
        hp: 3,
        nearbyFireDamage: false,
        inWater: false,
        fleeing: false,
      }),
    ).toBe('healing');
  });

  it('drinking blocks throw', () => {
    const w = makeWitch();
    startDrink(w, 0);
    expect(isDrinking(w, 100)).toBe(true);
    expect(tryThrow(w, { nowMs: 100, targetInRange: true, rand: () => 0 })).toBeNull();
    expect(isDrinking(w, DRINK_DURATION_MS + 1)).toBe(false);
  });
});
