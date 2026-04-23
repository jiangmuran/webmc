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
});
