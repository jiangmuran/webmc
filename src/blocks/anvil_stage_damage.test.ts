import { describe, it, expect } from 'vitest';
import { nextStage, damageOnUse, damageOnFall } from './anvil_stage_damage';

describe('anvil stage damage', () => {
  it('progression', () => {
    expect(nextStage('anvil')).toBe('chipped_anvil');
    expect(nextStage('chipped_anvil')).toBe('damaged_anvil');
    expect(nextStage('damaged_anvil')).toBe('destroyed');
  });

  it('use sometimes damages', () => {
    expect(damageOnUse('anvil', () => 0)).toBe('chipped_anvil');
    expect(damageOnUse('anvil', () => 0.99)).toBe('anvil');
  });

  it('fall compounds damage', () => {
    expect(damageOnFall('anvil', 2)).toBe('damaged_anvil');
    expect(damageOnFall('anvil', 3)).toBe('destroyed');
  });

  it('destroyed stays destroyed', () => {
    expect(damageOnUse('destroyed', () => 0)).toBe('destroyed');
    expect(damageOnFall('destroyed', 10)).toBe('destroyed');
  });
});
