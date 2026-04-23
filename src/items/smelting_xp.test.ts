import { describe, it, expect } from 'vitest';
import { lookup, accumulateXp, xpOrbsFromBank, canSmelt } from './smelting_xp';

describe('smelting xp', () => {
  it('lookup iron ore', () => {
    const r = lookup('iron_ore');
    expect(r?.output).toBe('iron_ingot');
  });

  it('lookup unknown null', () => {
    expect(lookup('stone')).toBeNull();
  });

  it('accumulate multiplies items', () => {
    const r = lookup('iron_ore');
    if (!r) throw new Error('fail');
    expect(accumulateXp(0, r, 10)).toBeCloseTo(7);
  });

  it('orbs floor bank', () => {
    expect(xpOrbsFromBank(3.7)).toBe(3);
  });

  it('canSmelt positive', () => {
    expect(canSmelt('iron_ore')).toBe(true);
    expect(canSmelt('stone')).toBe(false);
  });
});
