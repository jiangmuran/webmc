import { describe, it, expect } from 'vitest';
import { breakPot, interactPot, isPottable, makeFlowerPot } from './flower_pot';

describe('flower pot', () => {
  it('insert flower', () => {
    const pot = makeFlowerPot();
    const r = interactPot({ pot, heldItem: 'webmc:poppy' });
    expect(r.consumedHeld).toBe(true);
    expect(pot.content).toBe('webmc:poppy');
  });

  it('cannot insert non-pottable', () => {
    const pot = makeFlowerPot();
    const r = interactPot({ pot, heldItem: 'webmc:diamond' });
    expect(r.changed).toBe(false);
  });

  it('cannot insert over existing', () => {
    const pot = makeFlowerPot('webmc:poppy');
    const r = interactPot({ pot, heldItem: 'webmc:allium' });
    expect(r.changed).toBe(false);
  });

  it('empty hand extracts plant', () => {
    const pot = makeFlowerPot('webmc:poppy');
    const r = interactPot({ pot, heldItem: null });
    expect(r.yieldedPlant).toBe('webmc:poppy');
    expect(pot.content).toBeNull();
  });

  it('empty hand on empty pot = no-op', () => {
    const pot = makeFlowerPot();
    const r = interactPot({ pot, heldItem: null });
    expect(r.changed).toBe(false);
  });

  it('break drops pot + content', () => {
    const pot = makeFlowerPot('webmc:poppy');
    const drops = breakPot(pot);
    expect(drops.length).toBe(2);
  });

  it('break empty drops pot only', () => {
    expect(breakPot(makeFlowerPot()).length).toBe(1);
  });

  it('isPottable', () => {
    expect(isPottable('webmc:poppy')).toBe(true);
    expect(isPottable('webmc:sugar_cane')).toBe(false);
  });
});
