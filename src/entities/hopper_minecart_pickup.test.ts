import { describe, it, expect } from 'vitest';
import { makeCart, tryAbsorbItem, depositInto, ITEM_PICKUP_RADIUS } from './hopper_minecart_pickup';

describe('hopper minecart pickup', () => {
  it('absorbs into empty', () => {
    const c = makeCart();
    expect(tryAbsorbItem(c, 'diamond')).toBe(true);
    expect(c.slots[0]).toBe('diamond');
  });

  it('full cart rejects', () => {
    const c = makeCart();
    for (let i = 0; i < 5; i++) tryAbsorbItem(c, 'stone');
    expect(tryAbsorbItem(c, 'dirt')).toBe(false);
  });

  it('deposit transfers', () => {
    const c = makeCart();
    tryAbsorbItem(c, 'a');
    tryAbsorbItem(c, 'b');
    const target = makeCart();
    expect(depositInto(c, target)).toBe(2);
    expect(target.slots[0]).toBe('a');
  });

  it('pickup radius', () => {
    expect(ITEM_PICKUP_RADIUS).toBeGreaterThan(0);
  });
});
