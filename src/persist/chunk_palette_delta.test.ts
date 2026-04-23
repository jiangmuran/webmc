import { describe, it, expect } from 'vitest';
import {
  paletteIndex,
  addBlock,
  removeUnused,
  bitsForPalette,
} from './chunk_palette_delta';

describe('chunk palette delta', () => {
  it('finds existing', () => {
    expect(paletteIndex({ entries: ['air', 'stone'] }, 'stone')).toBe(1);
  });

  it('add new', () => {
    const r = addBlock({ entries: ['air'] }, 'stone');
    expect(r.idx).toBe(1);
    expect(r.palette.entries).toEqual(['air', 'stone']);
  });

  it('add existing returns existing index', () => {
    const r = addBlock({ entries: ['air', 'stone'] }, 'stone');
    expect(r.idx).toBe(1);
    expect(r.palette.entries).toHaveLength(2);
  });

  it('remove unused compacts', () => {
    const p = removeUnused({ entries: ['air', 'stone', 'dirt'] }, new Set([0, 2]));
    expect(p.entries).toEqual(['air', 'dirt']);
  });

  it('bits matches palette', () => {
    expect(bitsForPalette(1)).toBe(0);
    expect(bitsForPalette(16)).toBe(4);
    expect(bitsForPalette(17)).toBe(5);
  });
});
