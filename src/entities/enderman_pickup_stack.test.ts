import { describe, it, expect } from 'vitest';
import { canPickUp, tryPickup, dropHeld } from './enderman_pickup_stack';

describe('enderman pickup', () => {
  it('whitelist', () => {
    expect(canPickUp('webmc:grass_block')).toBe(true);
    expect(canPickUp('webmc:stone')).toBe(false);
  });

  it('pickup then drop', () => {
    const s = { held: null as string | null };
    expect(tryPickup(s, 'webmc:dirt')).toBe(true);
    expect(tryPickup(s, 'webmc:sand')).toBe(false);
    expect(dropHeld(s)).toBe('webmc:dirt');
    expect(s.held).toBeNull();
  });

  it('rejects non-whitelist', () => {
    const s = { held: null as string | null };
    expect(tryPickup(s, 'webmc:stone')).toBe(false);
  });
});
