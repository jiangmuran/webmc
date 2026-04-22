import { describe, it, expect } from 'vitest';
import { applyEnchant, type Enchanted } from './enchantment';
import { bowShot } from './infinity_bow';

const plainBow: Enchanted = { itemId: 1, count: 1, damage: 0 };
const infinityBow = applyEnchant(plainBow, 'infinity', 1);

describe('infinity bow', () => {
  it('no arrow → no shot', () => {
    const r = bowShot({ bow: plainBow, arrowName: 'webmc:arrow', hasArrow: false });
    expect(r.fired).toBe(false);
  });

  it('infinity + plain arrow → no consume, no pickup', () => {
    const r = bowShot({ bow: infinityBow, arrowName: 'webmc:arrow', hasArrow: true });
    expect(r.consumesArrow).toBe(false);
    expect(r.arrowCanBePickedUp).toBe(false);
  });

  it('infinity + tipped arrow still consumes', () => {
    const r = bowShot({ bow: infinityBow, arrowName: 'webmc:tipped_arrow', hasArrow: true });
    expect(r.consumesArrow).toBe(true);
  });

  it('plain bow consumes + pickable', () => {
    const r = bowShot({ bow: plainBow, arrowName: 'webmc:arrow', hasArrow: true });
    expect(r.consumesArrow).toBe(true);
    expect(r.arrowCanBePickedUp).toBe(true);
  });
});
