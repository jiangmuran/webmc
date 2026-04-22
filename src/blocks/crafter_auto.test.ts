import { describe, it, expect } from 'vitest';
import { makeCrafter, onPowerRise, popOutput, comparatorOutput, lockSlot } from './crafter_auto';

describe('crafter', () => {
  it('crafts on pulse', () => {
    const c = makeCrafter();
    if (c.slots[0]) c.slots[0].item = { id: 'webmc:stick', count: 1 };
    if (c.slots[1]) c.slots[1].item = { id: 'webmc:stick', count: 1 };
    const r = onPowerRise(c, {
      resolveRecipe: () => ({ id: 'webmc:torch', count: 4 }),
    });
    expect(r).toBe(true);
    expect(c.outputQueue[0]?.id).toBe('webmc:torch');
  });

  it('no recipe = no craft', () => {
    const c = makeCrafter();
    expect(onPowerRise(c, { resolveRecipe: () => null })).toBe(false);
  });

  it('comparator counts filled', () => {
    const c = makeCrafter();
    if (c.slots[0]) c.slots[0].item = { id: 'webmc:stick', count: 1 };
    if (c.slots[3]) c.slots[3].item = { id: 'webmc:coal', count: 1 };
    expect(comparatorOutput(c)).toBe(2);
  });

  it('empty = 0', () => {
    expect(comparatorOutput(makeCrafter())).toBe(0);
  });

  it('lock slot', () => {
    const c = makeCrafter();
    expect(lockSlot(c, 0)).toBe(true);
    expect(c.slots[0]?.locked).toBe(true);
  });

  it('pop output', () => {
    const c = makeCrafter();
    c.outputQueue.push({ id: 'webmc:torch', count: 4 });
    expect(popOutput(c)?.id).toBe('webmc:torch');
    expect(popOutput(c)).toBeNull();
  });
});
