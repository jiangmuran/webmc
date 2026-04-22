import { describe, it, expect } from 'vitest';
import {
  anvilPassThroughDamage,
  tryDegrade,
  DAMAGE_PER_BLOCK,
  MAX_DAMAGE,
  DEGRADE_CHANCE,
} from './anvil_fall_damage';

describe('anvil fall', () => {
  it('damage formula', () => {
    expect(anvilPassThroughDamage(1)).toBe(0);
    expect(anvilPassThroughDamage(5)).toBe(4 * DAMAGE_PER_BLOCK);
  });

  it('cap', () => {
    expect(anvilPassThroughDamage(1000)).toBe(MAX_DAMAGE);
  });

  it('degrades on roll', () => {
    expect(tryDegrade('webmc:anvil', () => 0)).toBe('webmc:chipped_anvil');
  });

  it('no degrade on high roll', () => {
    expect(tryDegrade('webmc:anvil', () => DEGRADE_CHANCE + 0.01)).toBeNull();
  });

  it('damaged anvil destroys', () => {
    expect(tryDegrade('webmc:damaged_anvil', () => 0)).toBe('destroyed');
  });
});
