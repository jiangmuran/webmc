import { describe, it, expect } from 'vitest';
import { addSmeltXp, breakFurnaceXp, collectFurnaceXp, makeFurnaceXpBank } from './furnace_xp_bank';

describe('furnace XP bank', () => {
  it('empty bank', () => {
    const b = makeFurnaceXpBank();
    expect(b.accumulated).toBe(0);
  });

  it('addSmeltXp accumulates', () => {
    const b = makeFurnaceXpBank();
    addSmeltXp(b, 0.7);
    addSmeltXp(b, 0.7);
    expect(b.accumulated).toBeCloseTo(1.4);
  });

  it('collect drops integer orbs', () => {
    const b = makeFurnaceXpBank();
    addSmeltXp(b, 2);
    const r = collectFurnaceXp({
      bank: b,
      itemsCollected: 0,
      xpPerSmelt: 0,
      rng: () => 0.5,
    });
    expect(r.xpOrbs).toBe(2);
  });

  it('fractional XP rolls bonus', () => {
    const b = makeFurnaceXpBank();
    addSmeltXp(b, 0.5);
    const r = collectFurnaceXp({
      bank: b,
      itemsCollected: 0,
      xpPerSmelt: 0,
      rng: () => 0.1,
    });
    expect(r.xpOrbs).toBe(1); // bonus triggered
  });

  it('break releases all', () => {
    const b = makeFurnaceXpBank();
    addSmeltXp(b, 3.4);
    expect(breakFurnaceXp(b)).toBe(3);
    expect(b.accumulated).toBe(0);
  });
});
