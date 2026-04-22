import { describe, it, expect } from 'vitest';
import { CONFLICT_GROUPS, EXTRA_ENCHANTS, conflicts, getExtraEnchant } from './enchant_compat';

describe('enchant compatibility', () => {
  it('fortune and silk_touch conflict', () => {
    expect(conflicts('fortune', 'silk_touch')).toBe(true);
  });

  it('sharpness / smite / bane are mutually exclusive', () => {
    expect(conflicts('sharpness', 'smite')).toBe(true);
    expect(conflicts('smite', 'bane_of_arthropods')).toBe(true);
  });

  it('unrelated enchants do not conflict', () => {
    expect(conflicts('sharpness', 'unbreaking')).toBe(false);
    expect(conflicts('protection', 'sharpness')).toBe(false);
  });

  it('same enchant does not conflict with itself', () => {
    expect(conflicts('sharpness', 'sharpness')).toBe(false);
  });

  it('conflict groups are declared', () => {
    expect(CONFLICT_GROUPS.length).toBeGreaterThanOrEqual(7);
  });

  it('extra enchants covers mending, infinity, riptide, etc.', () => {
    expect(getExtraEnchant('mending')).not.toBeNull();
    expect(getExtraEnchant('riptide')?.maxLevel).toBe(3);
    expect(EXTRA_ENCHANTS.length).toBeGreaterThan(20);
  });
});
