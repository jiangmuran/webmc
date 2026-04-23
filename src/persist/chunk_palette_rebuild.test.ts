import { describe, it, expect } from 'vitest';
import { rebuildPalette, bitsPerIndex } from './chunk_palette_rebuild';

describe('chunk palette rebuild', () => {
  it('drops unused entries', () => {
    const out = rebuildPalette({
      palette: ['air', 'stone', 'dirt'],
      indices: [0, 0, 1, 1],
    });
    expect(out.palette).toEqual(['air', 'stone']);
  });

  it('remaps indices', () => {
    const out = rebuildPalette({
      palette: ['air', 'stone', 'dirt'],
      indices: [2, 2, 0],
    });
    expect(out.palette).toContain('dirt');
    expect(out.indices[0]).toBe(out.palette.indexOf('dirt'));
  });

  it('empty palette fallback', () => {
    const out = rebuildPalette({ palette: [], indices: [] });
    expect(out.palette).toEqual(['air']);
  });

  it('1 entry 0 bits', () => {
    expect(bitsPerIndex(1)).toBe(0);
  });

  it('17 entries 5 bits min', () => {
    expect(bitsPerIndex(17)).toBeGreaterThanOrEqual(5);
  });

  it('2 entries floor is 4', () => {
    expect(bitsPerIndex(2)).toBe(4);
  });
});
