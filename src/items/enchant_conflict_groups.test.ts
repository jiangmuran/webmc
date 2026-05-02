import { describe, it, expect } from 'vitest';
import { conflicts, anyConflicts } from './enchant_conflict_groups';

describe('enchant conflicts', () => {
  it('sharpness vs smite', () => {
    expect(conflicts('sharpness', 'smite')).toBe(true);
  });

  it('sharpness self no conflict', () => {
    expect(conflicts('sharpness', 'sharpness')).toBe(false);
  });

  it('protection vs fire protection', () => {
    expect(conflicts('protection', 'fire_protection')).toBe(true);
  });

  it('unrelated enchants ok', () => {
    expect(conflicts('sharpness', 'unbreaking')).toBe(false);
  });

  it('fortune/silk touch conflict', () => {
    expect(conflicts('fortune', 'silk_touch')).toBe(true);
  });

  it('anyConflicts detects match', () => {
    expect(anyConflicts(['sharpness'], 'smite')).toBe(true);
  });

  it('anyConflicts ignores compatible', () => {
    expect(anyConflicts(['sharpness', 'unbreaking'], 'mending')).toBe(false);
  });

  it('riptide conflicts with loyalty AND channeling', () => {
    expect(conflicts('riptide', 'loyalty')).toBe(true);
    expect(conflicts('riptide', 'channeling')).toBe(true);
  });

  it('breach (mace) conflicts with damage enchants and density (wiki)', () => {
    // Wiki (minecraft.wiki/w/Breach): "Breach is incompatible with
    // Density, Smite, and Bane of Arthropods. It is also incompatible
    // with Sharpness and Impaling..."
    expect(conflicts('breach', 'density')).toBe(true);
    expect(conflicts('breach', 'smite')).toBe(true);
    expect(conflicts('breach', 'bane_of_arthropods')).toBe(true);
    expect(conflicts('breach', 'sharpness')).toBe(true);
    expect(conflicts('breach', 'impaling')).toBe(true);
  });
});
