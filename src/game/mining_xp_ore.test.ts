import { describe, it, expect } from 'vitest';
import { xpForOre } from './mining_xp_ore';

describe('mining xp ore', () => {
  it('diamond gives 3-7', () => {
    const xp = xpForOre('diamond_ore', () => 0.5, false);
    expect(xp).toBeGreaterThanOrEqual(3);
    expect(xp).toBeLessThanOrEqual(7);
  });

  it('iron gives 0', () => {
    expect(xpForOre('iron_ore', () => 0.5, false)).toBe(0);
  });

  it('silk touch 0', () => {
    expect(xpForOre('diamond_ore', () => 0.9, true)).toBe(0);
  });

  it('unknown ore 0', () => {
    expect(xpForOre('stone', () => 0.5, false)).toBe(0);
  });
});
