import { describe, it, expect } from 'vitest';
import {
  makeCrafter,
  pulseCrafter,
  takeOutput,
  toggleDisabled,
  type CrafterState,
} from './crafter';
import type { ItemStack } from '@/items/item';

function setSlot(c: CrafterState, idx: number, item: ItemStack): void {
  c.slots[idx] = item;
}

describe('crafter', () => {
  it('pulse refuses when no recipe matches', () => {
    const c = makeCrafter();
    setSlot(c, 4, { itemId: 99, count: 1, damage: 0 });
    const pulsed = pulseCrafter(c, { matchRecipe: () => null });
    expect(pulsed).toBe(false);
    expect(c.output).toBeNull();
  });

  it('pulse with a matching recipe consumes + outputs', () => {
    const c = makeCrafter();
    setSlot(c, 4, { itemId: 5, count: 1, damage: 0 });
    const pulsed = pulseCrafter(c, {
      matchRecipe: () => ({ itemId: 10, count: 1, damage: 0 }),
    });
    expect(pulsed).toBe(true);
    expect(c.output?.itemId).toBe(10);
    expect(c.slots[4]).toBeNull();
  });

  it('refuses to pulse when output slot is occupied', () => {
    const c = makeCrafter();
    c.output = { itemId: 11, count: 1, damage: 0 };
    setSlot(c, 4, { itemId: 5, count: 1, damage: 0 });
    const pulsed = pulseCrafter(c, {
      matchRecipe: () => ({ itemId: 10, count: 1, damage: 0 }),
    });
    expect(pulsed).toBe(false);
  });

  it('takeOutput clears and returns stack', () => {
    const c = makeCrafter();
    c.output = { itemId: 11, count: 2, damage: 0 };
    const out = takeOutput(c);
    expect(out?.itemId).toBe(11);
    expect(c.output).toBeNull();
  });

  it('disabled slots are skipped in recipe matching', () => {
    const c = makeCrafter();
    setSlot(c, 0, { itemId: 5, count: 1, damage: 0 });
    toggleDisabled(c, 0);
    const captured: (ItemStack | null)[][][] = [];
    pulseCrafter(c, {
      matchRecipe: (grid) => {
        captured.push(grid.map((r) => [...r]));
        return null;
      },
    });
    expect(captured.length).toBe(1);
    expect(captured[0]?.[0]?.[0]).toBeNull();
  });
});
