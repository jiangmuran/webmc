import { describe, it, expect } from 'vitest';
import {
  canPickup,
  makeEndermanPickup,
  tryPickup,
  tryPlace,
  PICKUP_CHANCE_PER_TICK,
  PLACE_CHANCE_PER_TICK,
} from './enderman_pickup';

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
    // Place chance is 1/2000 per tick — need many trials.
    for (let i = 0; i < 50000; i++) {
      const r = tryPlace(s, Math.random);
      if (r.placed) {
        placed = true;
        expect(r.placedBlock).toBe('webmc:sand');
        break;
      }
    }
    expect(placed).toBe(true);
  });

  it('pickup chance is 1/20 per tick (wiki)', () => {
    expect(PICKUP_CHANCE_PER_TICK).toBe(1 / 20);
    const s = makeEndermanPickup();
    expect(tryPickup(s, 'webmc:grass_block', () => 0.04999).picked).toBe(true);
    s.carrying = null;
    expect(tryPickup(s, 'webmc:grass_block', () => 0.05).picked).toBe(false);
  });

  it('place chance is 1/2000 per tick (wiki)', () => {
    expect(PLACE_CHANCE_PER_TICK).toBe(1 / 2000);
    const s = makeEndermanPickup();
    s.carrying = 'webmc:sand';
    expect(tryPlace(s, () => 0.000499).placed).toBe(true);
    s.carrying = 'webmc:sand';
    expect(tryPlace(s, () => 0.0005).placed).toBe(false);
  });
});
