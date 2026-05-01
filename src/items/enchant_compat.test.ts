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

  it('density conflicts only with breach (wiki)', () => {
    // Wiki minecraft.wiki/w/Density: "Density is mutually exclusive
    // with Breach" — and only Breach. Should NOT conflict with
    // sharpness/smite/bane/impaling.
    expect(conflicts('density', 'breach')).toBe(true);
    expect(conflicts('density', 'sharpness')).toBe(false);
    expect(conflicts('density', 'smite')).toBe(false);
    expect(conflicts('density', 'bane_of_arthropods')).toBe(false);
    expect(conflicts('density', 'impaling')).toBe(false);
  });

  it('impaling conflicts only with breach (wiki)', () => {
    expect(conflicts('impaling', 'breach')).toBe(true);
    expect(conflicts('impaling', 'sharpness')).toBe(false);
  });

  it('breach asymmetric exclusion list per wiki', () => {
    // Wiki minecraft.wiki/w/Breach: incompatible with Sharpness,
    // Smite, Bane, Density, Impaling.
    expect(conflicts('breach', 'sharpness')).toBe(true);
    expect(conflicts('breach', 'smite')).toBe(true);
    expect(conflicts('breach', 'bane_of_arthropods')).toBe(true);
    expect(conflicts('breach', 'density')).toBe(true);
    expect(conflicts('breach', 'impaling')).toBe(true);
  });

  it('extra enchants covers mending, infinity, riptide, etc.', () => {
    expect(getExtraEnchant('mending')).not.toBeNull();
    expect(getExtraEnchant('riptide')?.maxLevel).toBe(3);
    expect(EXTRA_ENCHANTS.length).toBeGreaterThan(20);
  });
});
