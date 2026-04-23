import { describe, it, expect } from 'vitest';
import { betterThan, shouldPickUp, type MobLoadout } from './mob_pickup_items';

const empty: MobLoadout = {
  mainhand: null,
  helmet: null,
  chestplate: null,
  leggings: null,
  boots: null,
};

describe('mob pickup items', () => {
  it('better when nothing held', () => {
    expect(betterThan({ id: 'iron_sword', tier: 3 }, null)).toBe(true);
  });

  it('better only if higher tier', () => {
    expect(betterThan({ id: 'stone_sword', tier: 2 }, { id: 'iron_sword', tier: 3 })).toBe(false);
  });

  it('sword fills mainhand', () => {
    expect(shouldPickUp(empty, { id: 'iron_sword', tier: 3 })).toBe('mainhand');
  });

  it('helmet fills helmet', () => {
    expect(shouldPickUp(empty, { id: 'iron_helmet', tier: 3 })).toBe('helmet');
  });

  it('junk item ignored', () => {
    expect(shouldPickUp(empty, { id: 'stone', tier: 1 })).toBeNull();
  });
});
