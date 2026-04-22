import { describe, it, expect } from 'vitest';
import { strippedFor, carvePumpkin } from './stripped_log_axe';

describe('axe strip', () => {
  it('oak log → stripped', () => {
    expect(strippedFor('webmc:oak_log')).toBe('webmc:stripped_oak_log');
  });

  it('nether stems supported', () => {
    expect(strippedFor('webmc:crimson_stem')).toBe('webmc:stripped_crimson_stem');
  });

  it('non-log null', () => {
    expect(strippedFor('webmc:stone')).toBeNull();
  });

  it('pumpkin carve', () => {
    const r = carvePumpkin('webmc:pumpkin');
    expect(r?.carved).toBe('webmc:carved_pumpkin');
    expect(r?.drops.count).toBe(4);
  });

  it('non-pumpkin null', () => {
    expect(carvePumpkin('webmc:stone')).toBeNull();
  });
});
