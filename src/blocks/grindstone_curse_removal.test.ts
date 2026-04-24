import { describe, it, expect } from 'vitest';
import {
  strippable,
  retained,
  xpValueOfStripped,
  repairAmount,
  type Enchantment,
} from './grindstone_curse_removal';

const enchants: Enchantment[] = [
  { id: 'sharpness', level: 3 },
  { id: 'mending', level: 1 },
  { id: 'curse_of_vanishing', level: 1 },
];

describe('grindstone curse removal', () => {
  it('non-curses strippable', () => {
    expect(strippable(enchants).map((e) => e.id)).toEqual(['sharpness', 'mending']);
  });

  it('curses retained', () => {
    expect(retained(enchants).map((e) => e.id)).toEqual(['curse_of_vanishing']);
  });

  it('xp value counted', () => {
    expect(xpValueOfStripped(enchants)).toBeGreaterThan(0);
  });

  it('only curses → no xp', () => {
    expect(xpValueOfStripped([{ id: 'curse_of_vanishing', level: 1 }])).toBe(0);
  });

  it('repair adds bonus', () => {
    expect(repairAmount(100, 100, 1000)).toBeGreaterThan(200);
  });

  it('repair caps at max', () => {
    expect(repairAmount(999, 999, 1000)).toBe(1000);
  });
});
