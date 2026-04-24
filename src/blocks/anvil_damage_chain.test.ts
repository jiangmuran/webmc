import { describe, it, expect } from 'vitest';
import { nextDamage, onUse, isBroken, USE_DAMAGE_CHANCE } from './anvil_damage_chain';

describe('anvil damage chain', () => {
  it('anvil → chipped', () => {
    expect(nextDamage('anvil')).toBe('chipped_anvil');
  });

  it('damaged → undefined (breaks)', () => {
    expect(nextDamage('damaged_anvil')).toBeUndefined();
  });

  it('onUse unlucky damages', () => {
    expect(onUse('anvil', () => 0)).toBe('chipped_anvil');
  });

  it('onUse lucky safe', () => {
    expect(onUse('anvil', () => 0.99)).toBe('anvil');
  });

  it('damage chance defined', () => {
    expect(USE_DAMAGE_CHANCE).toBeGreaterThan(0);
  });

  it('broken detect', () => {
    expect(isBroken(undefined)).toBe(true);
    expect(isBroken('anvil')).toBe(false);
  });
});
