import { describe, it, expect } from 'vitest';
import { isRaft, hasChest, baseSpeedMult, RAFT_SEAT_COUNT } from './bamboo_raft';

describe('bamboo raft', () => {
  it('raft detection', () => {
    expect(isRaft('bamboo_raft')).toBe(true);
    expect(isRaft('oak_boat')).toBe(false);
  });

  it('chest variant', () => {
    expect(hasChest('oak_chest_boat')).toBe(true);
    expect(hasChest('bamboo_raft')).toBe(false);
  });

  it('2 seats', () => {
    expect(RAFT_SEAT_COUNT).toBe(2);
  });

  it('slightly slower', () => {
    expect(baseSpeedMult()).toBeLessThan(1);
  });
});
