import { describe, it, expect } from 'vitest';
import { isCompatible, incompatibleWith } from './enchant_compat_matrix';

describe('enchant compat matrix', () => {
  it('protection excludes siblings', () => {
    expect(isCompatible('protection', 'blast_protection')).toBe(false);
  });

  it('sharpness vs efficiency (cross-kind) ok', () => {
    expect(isCompatible('sharpness', 'efficiency')).toBe(true);
  });

  it('infinity vs mending', () => {
    expect(isCompatible('infinity', 'mending')).toBe(false);
  });

  it('multishot vs piercing', () => {
    expect(isCompatible('multishot', 'piercing')).toBe(false);
  });

  it('incompatibleWith list', () => {
    expect(incompatibleWith('sharpness')).toContain('smite');
  });

  it('Density only conflicts with Breach (wiki)', () => {
    // Wiki (minecraft.wiki/w/Density): "Density is mutually exclusive
    // with Breach" — and ONLY Breach. Density+Sharpness on a mace is
    // canonical.
    expect(incompatibleWith('density')).toEqual(['breach']);
    expect(isCompatible('density', 'sharpness')).toBe(true);
    expect(isCompatible('density', 'smite')).toBe(true);
    expect(isCompatible('density', 'bane_of_arthropods')).toBe(true);
    expect(isCompatible('density', 'breach')).toBe(false);
  });

  it('Breach conflicts with damage family + density + impaling (wiki)', () => {
    expect(isCompatible('breach', 'sharpness')).toBe(false);
    expect(isCompatible('breach', 'smite')).toBe(false);
    expect(isCompatible('breach', 'bane_of_arthropods')).toBe(false);
    expect(isCompatible('breach', 'density')).toBe(false);
    expect(isCompatible('breach', 'impaling')).toBe(false);
  });
});
