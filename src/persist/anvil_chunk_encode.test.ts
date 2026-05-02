import { describe, it, expect } from 'vitest';
import { encodeChunkRoot } from './anvil_chunk_encode';
import { parseChunkSections } from './anvil_section_parse';
import { encodeNbt } from './nbt_encode';
import { decodeNbt } from './nbt_decode';

const SECTION_BLOCKS = 16 * 16 * 16;

describe('Anvil chunk encoder', () => {
  it('builds a chunk root with DataVersion and sections', () => {
    const idx = new Uint16Array(SECTION_BLOCKS);
    for (let i = 0; i < idx.length; i++) idx[i] = i % 2;
    const root = encodeChunkRoot({
      dataVersion: 3955,
      sections: [
        {
          y: 0,
          paletteNames: ['minecraft:air', 'minecraft:stone'],
          indices: idx,
        },
      ],
    });
    expect(root.name).toBe('');
    if (root.value.type !== 'compound') throw new Error('not compound');
    expect(root.value.value['DataVersion']).toEqual({ type: 'int', value: 3955 });
    const sections = parseChunkSections(root.value);
    expect(sections.length).toBe(1);
    expect(sections[0]?.y).toBe(0);
    expect(sections[0]?.palette[1]?.name).toBe('minecraft:stone');
    for (let i = 0; i < SECTION_BLOCKS; i++) {
      expect(sections[0]?.indices[i]).toBe(i % 2);
    }
  });

  it('round-trips through encodeNbt → decodeNbt → parseChunkSections', () => {
    const idx = new Uint16Array(SECTION_BLOCKS);
    for (let i = 0; i < idx.length; i++) idx[i] = i % 4;
    const root = encodeChunkRoot({
      dataVersion: 3955,
      xPos: 5,
      yPos: -4,
      zPos: -3,
      sections: [
        {
          y: -4,
          paletteNames: ['minecraft:air', 'minecraft:dirt', 'minecraft:stone', 'minecraft:gravel'],
          indices: idx,
        },
      ],
    });
    const bytes = encodeNbt(root);
    const decoded = decodeNbt(bytes);
    if (decoded.value.type !== 'compound') throw new Error('not compound');
    expect(decoded.value.value['xPos']).toEqual({ type: 'int', value: 5 });
    expect(decoded.value.value['yPos']).toEqual({ type: 'int', value: -4 });
    const sections = parseChunkSections(decoded.value);
    expect(sections.length).toBe(1);
    expect(sections[0]?.palette.length).toBe(4);
    for (let i = 0; i < SECTION_BLOCKS; i++) {
      expect(sections[0]?.indices[i]).toBe(i % 4);
    }
  });

  it('encodes multiple sections and preserves Y order', () => {
    const empty = new Uint16Array(SECTION_BLOCKS);
    const root = encodeChunkRoot({
      dataVersion: 3955,
      sections: [
        { y: 0, paletteNames: ['minecraft:air'], indices: empty },
        { y: 1, paletteNames: ['minecraft:stone'], indices: empty },
        { y: 2, paletteNames: ['minecraft:dirt'], indices: empty },
      ],
    });
    const sections = parseChunkSections(root.value);
    expect(sections.map((s) => s.y)).toEqual([0, 1, 2]);
  });
});
