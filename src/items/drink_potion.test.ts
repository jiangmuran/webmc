import { describe, it, expect } from 'vitest';
import { canDrink, drinkReturnsEmptyBottle, effectsApplied, DRINK_TICKS } from './drink_potion';

describe('drink potion', () => {
  it('only normal drinkable', () => {
    expect(canDrink({ kind: 'normal', effects: [] })).toBe(true);
    expect(canDrink({ kind: 'splash', effects: [] })).toBe(false);
  });

  it('drink returns empty bottle', () => {
    expect(drinkReturnsEmptyBottle()).toBe(true);
  });

  it('applies effects', () => {
    const e = effectsApplied({
      kind: 'normal',
      effects: [{ id: 'regeneration', durationTicks: 900 }],
    });
    expect(e).toHaveLength(1);
  });

  it('splash does not self-apply', () => {
    expect(
      effectsApplied({ kind: 'splash', effects: [{ id: 'regen', durationTicks: 100 }] }),
    ).toHaveLength(0);
  });

  it('drink time 32t', () => {
    expect(DRINK_TICKS).toBe(32);
  });
});
