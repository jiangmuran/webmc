import { describe, it, expect } from 'vitest';
import { tryPickup, dropHeld, tryEatHeld, stealBerry, type Fox } from './fox_berry_steal';

function fox(overrides: Partial<Fox> = {}): Fox {
  return { heldItemId: null, tamed: false, ownerId: null, sitting: false, hp: 20, ...overrides };
}

describe('fox', () => {
  it('pickup and drop', () => {
    const f = fox();
    expect(tryPickup(f, 'webmc:sweet_berries')).toBe(true);
    expect(tryPickup(f, 'webmc:chicken')).toBe(false);
    expect(dropHeld(f)).toBe('webmc:sweet_berries');
  });

  it('eat golden apple heals', () => {
    const f = fox({ heldItemId: 'webmc:golden_apple' });
    const r = tryEatHeld(f);
    expect(r.ate).toBe(true);
    expect(r.hpGain).toBeGreaterThan(0);
  });

  it('non-food ignored', () => {
    const f = fox({ heldItemId: 'webmc:stone' });
    expect(tryEatHeld(f).ate).toBe(false);
  });

  it('wild steals berry', () => {
    const r = stealBerry({ bushBerries: 3, fox: fox() });
    expect(r.berry).toBe(true);
    expect(r.remainingOnBush).toBe(2);
  });

  it('tamed does not steal', () => {
    const r = stealBerry({ bushBerries: 3, fox: fox({ tamed: true }) });
    expect(r.berry).toBe(false);
  });
});
