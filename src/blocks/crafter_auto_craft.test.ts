import { describe, it, expect } from 'vitest';
import {
  comparatorSignal,
  makeCrafter,
  tickCrafter,
  toggleDisabledSlot,
  type Recipe,
} from './crafter_auto_craft';

const PLANKS_RECIPE: Recipe = {
  pattern: ['webmc:oak_log', null, null, null, null, null, null, null, null],
  output: { item: 'webmc:oak_planks', count: 4 },
};

describe('crafter', () => {
  it('does nothing without redstone edge', () => {
    const c = makeCrafter();
    const slot = c.slots[0];
    if (!slot) throw new Error();
    slot.item = 'webmc:oak_log';
    slot.count = 1;
    const r = tickCrafter(c, { redstoneEdge: false, recipes: [PLANKS_RECIPE] });
    expect(r.crafted).toBeNull();
  });

  it('crafts on edge with matching recipe', () => {
    const c = makeCrafter();
    const slot = c.slots[0];
    if (!slot) throw new Error();
    slot.item = 'webmc:oak_log';
    slot.count = 1;
    // disable other slots so they don't require items
    for (let i = 1; i < 9; i++) toggleDisabledSlot(c, i);
    const r = tickCrafter(c, { redstoneEdge: true, recipes: [PLANKS_RECIPE] });
    expect(r.crafted?.item).toBe('webmc:oak_planks');
  });

  it('consumes ingredients', () => {
    const c = makeCrafter();
    const slot = c.slots[0];
    if (!slot) throw new Error();
    slot.item = 'webmc:oak_log';
    slot.count = 2;
    for (let i = 1; i < 9; i++) toggleDisabledSlot(c, i);
    tickCrafter(c, { redstoneEdge: true, recipes: [PLANKS_RECIPE] });
    expect(c.slots[0]?.count).toBe(1);
  });

  it('comparator counts filled + disabled slots', () => {
    const c = makeCrafter();
    const slot = c.slots[0];
    if (!slot) throw new Error();
    slot.item = 'webmc:oak_log';
    slot.count = 1;
    toggleDisabledSlot(c, 3);
    expect(comparatorSignal(c)).toBe(2);
  });
});
