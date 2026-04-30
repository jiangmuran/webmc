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

  it('fall advances at most one stage on a lucky roll (wiki)', () => {
    // Wiki: 5% × blocks chance of single-stage degrade. 10-block drop
    // → 50% chance. With rng()=0 (always passes) we get exactly one
    // stage, NOT three.
    expect(damageOnFall('anvil', 10, () => 0)).toBe('chipped_anvil');
    expect(damageOnFall('anvil', 3, () => 0)).toBe('chipped_anvil');
  });

  it('fall ≤1 block never damages', () => {
    expect(damageOnFall('anvil', 1, () => 0)).toBe('anvil');
  });

  it('high roll spares the anvil', () => {
    expect(damageOnFall('anvil', 5, () => 0.99)).toBe('anvil');
  });

  it('destroyed stays destroyed', () => {
    expect(damageOnUse('destroyed', () => 0)).toBe('destroyed');
    expect(damageOnFall('destroyed', 10, () => 0)).toBe('destroyed');
  });
});
