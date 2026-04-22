import { describe, it, expect } from 'vitest';
import {
  addBottle,
  comparatorSignal,
  emptyCauldron,
  fillCauldron,
  makeCauldron,
  takeBottle,
  washItem,
} from './cauldron';

describe('cauldron', () => {
  it('empty → fill with water (level 3)', () => {
    const c = makeCauldron();
    fillCauldron(c, 'water');
    expect(c.content).toBe('water');
    expect(c.level).toBe(3);
  });

  it('refuses mixing water + lava', () => {
    const c = makeCauldron();
    fillCauldron(c, 'water');
    expect(fillCauldron(c, 'lava')).toBe(false);
    expect(c.content).toBe('water');
  });

  it('addBottle + takeBottle round-trips level', () => {
    const c = makeCauldron();
    fillCauldron(c, 'water');
    takeBottle(c);
    expect(c.level).toBe(2);
    addBottle(c);
    expect(c.level).toBe(3);
  });

  it('emptying returns to empty state', () => {
    const c = makeCauldron();
    fillCauldron(c, 'water');
    emptyCauldron(c);
    expect(c.content).toBe('empty');
    expect(c.level).toBe(0);
  });

  it('wash dyed item consumes 1 level', () => {
    const c = makeCauldron();
    fillCauldron(c, 'water');
    expect(
      washItem(c, {
        name: 'webmc:leather_chestplate',
        isDyed: true,
        isBanner: false,
        isShulkerBox: false,
      }),
    ).toBe(true);
    expect(c.level).toBe(2);
  });

  it('wash refuses non-washable items', () => {
    const c = makeCauldron();
    fillCauldron(c, 'water');
    expect(
      washItem(c, { name: 'webmc:stone', isDyed: false, isBanner: false, isShulkerBox: false }),
    ).toBe(false);
  });

  it('comparator signal = level', () => {
    const c = makeCauldron();
    expect(comparatorSignal(c)).toBe(0);
    fillCauldron(c, 'water');
    expect(comparatorSignal(c)).toBe(3);
  });
});
