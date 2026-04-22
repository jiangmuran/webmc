import { describe, it, expect } from 'vitest';
import {
  makeFurnace,
  addFuel,
  tickFurnace,
  burnTicksFor,
  SMELT_TICKS_PER_ITEM,
} from './furnace_smelt_progress';

describe('furnace progress', () => {
  it('fuel only once', () => {
    const f = makeFurnace();
    expect(addFuel(f, { id: 'webmc:coal', burnTicks: 1600 })).toBe(true);
    expect(addFuel(f, { id: 'webmc:coal', burnTicks: 1600 })).toBe(false);
  });

  it('no progress without input', () => {
    const f = makeFurnace();
    addFuel(f, { id: 'webmc:coal', burnTicks: 1600 });
    expect(tickFurnace(f, { recipeOutputId: null }).completedOneItem).toBe(false);
  });

  it('smelts one item', () => {
    const f = makeFurnace();
    f.inputId = 'webmc:iron_ore';
    addFuel(f, { id: 'webmc:coal', burnTicks: 1600 });
    for (let i = 0; i < SMELT_TICKS_PER_ITEM - 1; i++) {
      tickFurnace(f, { recipeOutputId: 'webmc:iron_ingot' });
    }
    expect(tickFurnace(f, { recipeOutputId: 'webmc:iron_ingot' }).completedOneItem).toBe(true);
    expect(f.outputCount).toBe(1);
  });

  it('burn ticks table', () => {
    expect(burnTicksFor('webmc:coal')).toBe(1600);
    expect(burnTicksFor('webmc:stone')).toBe(0);
  });
});
