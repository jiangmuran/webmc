import { describe, it, expect } from 'vitest';
import { xpOnBreak, dropsXpFurnaceExtract } from './block_break_xp';

describe('block break xp', () => {
  it('diamond ore gives xp', () => {
    expect(xpOnBreak('diamond_ore', () => 0.5, false)).toBeGreaterThan(0);
  });

  it('silk touch no xp', () => {
    expect(xpOnBreak('diamond_ore', () => 0.5, true)).toBe(0);
  });

  it('gold furnace bonus', () => {
    expect(dropsXpFurnaceExtract('gold_ingot', 10)).toBeGreaterThan(0);
  });

  it('unknown furnace output 0', () => {
    expect(dropsXpFurnaceExtract('netherrack', 10)).toBe(0);
  });
});
