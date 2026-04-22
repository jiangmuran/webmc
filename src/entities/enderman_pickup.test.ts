import { describe, it, expect } from 'vitest';
import { canPickup, makeEndermanPickup, tryPickup, tryPlace } from './enderman_pickup';

describe('enderman pickup', () => {
  it('grass blocks are carryable', () => {
    expect(canPickup('webmc:grass_block')).toBe(true);
    expect(canPickup('webmc:stone')).toBe(false);
  });

  it('sometimes picks up a valid block', () => {
    const s = makeEndermanPickup();
    let picked = false;
    for (let i = 0; i < 500; i++) {
      if (tryPickup(s, 'webmc:grass_block', Math.random).picked) {
        picked = true;
        break;
      }
    }
    expect(picked).toBe(true);
  });

  it('refuses second pickup while carrying', () => {
    const s = makeEndermanPickup();
    s.carrying = 'webmc:sand';
    expect(tryPickup(s, 'webmc:dirt', () => 0).picked).toBe(false);
  });

  it('sometimes places the carried block', () => {
    const s = makeEndermanPickup();
    s.carrying = 'webmc:sand';
    let placed = false;
    for (let i = 0; i < 500; i++) {
      const r = tryPlace(s, Math.random);
      if (r.placed) {
        placed = true;
        expect(r.placedBlock).toBe('webmc:sand');
        break;
      }
    }
    expect(placed).toBe(true);
  });
});
