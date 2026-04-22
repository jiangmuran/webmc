import { describe, it, expect } from 'vitest';
import { applyMendingOnOrb, repairFor } from './mending_xp';

describe('mending', () => {
  it('no mending items = orb goes to player', () => {
    const r = applyMendingOnOrb({
      heldMending: [],
      xpValue: 7,
      rng: () => 0,
    });
    expect(r.xpOverflowToPlayer).toBe(7);
  });

  it('repairs a damaged tool', () => {
    const pick = {
      id: 1,
      name: 'webmc:diamond_pickaxe',
      currentDurability: 100,
      maxDurability: 1561,
      hasMending: true,
    };
    const r = applyMendingOnOrb({
      heldMending: [pick],
      xpValue: 7,
      rng: () => 0,
    });
    expect(r.repairedItemId).toBe(1);
    expect(r.durabilityRestored).toBe(14);
    expect(pick.currentDurability).toBe(114);
  });

  it('xp overflow when repair saturated', () => {
    const pick = {
      id: 1,
      name: 'webmc:diamond_pickaxe',
      currentDurability: 1560,
      maxDurability: 1561,
      hasMending: true,
    };
    const r = applyMendingOnOrb({
      heldMending: [pick],
      xpValue: 10,
      rng: () => 0,
    });
    expect(r.xpOverflowToPlayer).toBeGreaterThan(0);
  });

  it('skips items without mending enchant', () => {
    const pick = {
      id: 1,
      name: 'webmc:diamond_pickaxe',
      currentDurability: 100,
      maxDurability: 1561,
      hasMending: false,
    };
    const r = applyMendingOnOrb({
      heldMending: [pick],
      xpValue: 10,
      rng: () => 0,
    });
    expect(r.repairedItemId).toBeNull();
  });

  it('repairFor helper', () => {
    expect(repairFor(5)).toBe(10);
  });
});
