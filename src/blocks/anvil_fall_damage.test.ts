import { describe, it, expect } from 'vitest';
import {
  anvilPassThroughDamage,
  tryDegrade,
  DAMAGE_PER_BLOCK,
  MAX_DAMAGE,
  FALL_DEGRADE_PER_BLOCK,
} from './anvil_fall_damage';

describe('anvil fall', () => {
  it('damage formula', () => {
    expect(anvilPassThroughDamage(1)).toBe(0);
    expect(anvilPassThroughDamage(5)).toBe(4 * DAMAGE_PER_BLOCK);
  });

  it('cap', () => {
    expect(anvilPassThroughDamage(1000)).toBe(MAX_DAMAGE);
  });

  it('degrades on roll (10-block fall = 50% chance)', () => {
    expect(tryDegrade('webmc:anvil', 10, () => 0)).toBe('webmc:chipped_anvil');
  });

  it('no degrade on high roll (10-block fall = 50% chance, rng 0.51)', () => {
    expect(tryDegrade('webmc:anvil', 10, () => 0.51)).toBeNull();
  });

  it('damaged anvil destroys (10-block fall = 50% chance, rng 0)', () => {
    expect(tryDegrade('webmc:damaged_anvil', 10, () => 0)).toBe('destroyed');
  });

  it('1-block fall cannot degrade (wiki: only > 1 block)', () => {
    expect(tryDegrade('webmc:anvil', 1, () => 0)).toBeNull();
  });

  it('chance scales 5% × blocks fallen', () => {
    // 4-block fall → 20% chance, rng 0.21 just above → no degrade.
    expect(tryDegrade('webmc:anvil', 4, () => 0.21)).toBeNull();
    // rng 0.19 just below → degrade.
    expect(tryDegrade('webmc:anvil', 4, () => 0.19)).toBe('webmc:chipped_anvil');
    expect(FALL_DEGRADE_PER_BLOCK).toBe(0.05);
  });
});
