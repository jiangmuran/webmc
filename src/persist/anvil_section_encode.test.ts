import { describe, it, expect } from 'vitest';
import { encodeSection, packIndices } from './anvil_section_encode';
import { parseSection } from './anvil_section_parse';

const SECTION_BLOCKS = 16 * 16 * 16;

describe('Anvil section encoder', () => {
  it('omits data field for single-entry palette', () => {
    const indices = new Uint16Array(SECTION_BLOCKS); // all zeros
    const v = encodeSection({ y: 0, paletteNames: ['minecraft:air'], indices });
    if (v.type !== 'compound') throw new Error('not compound');
    const bs = v.value['block_states'];
    if (bs?.type !== 'compound') throw new Error('not bs');
    expect(bs.value['data']).toBeUndefined();
    expect(bs.value['palette']?.type).toBe('list');
  });

  it('round-trips a 2-entry section through parseSection', () => {
    // 2-entry palette: bits=4, 16 indices per long.
    const indices = new Uint16Array(SECTION_BLOCKS);
    for (let i = 0; i < indices.length; i++) indices[i] = i % 2;
    const v = encodeSection({
      y: 7,
      paletteNames: ['minecraft:air', 'minecraft:stone'],
      indices,
    });
    const back = parseSection(v, 7);
    expect(back).not.toBeNull();
    if (!back) return;
    expect(back.y).toBe(7);
    expect(back.palette[0]?.name).toBe('minecraft:air');
    expect(back.palette[1]?.name).toBe('minecraft:stone');
    for (let i = 0; i < SECTION_BLOCKS; i++) {
      expect(back.indices[i], `index ${String(i)}`).toBe(i % 2);
    }
  });

  it('round-trips a 17-entry palette (5-bit width)', () => {
    // 5 bits → 12 indices per long.
    const palette: string[] = [];
    for (let i = 0; i < 17; i++) palette.push(`minecraft:block_${i}`);
    const indices = new Uint16Array(SECTION_BLOCKS);
    for (let i = 0; i < indices.length; i++) indices[i] = i % 17;
    const v = encodeSection({ y: 0, paletteNames: palette, indices });
    const back = parseSection(v, 0);
    expect(back).not.toBeNull();
    if (!back) return;
    expect(back.palette.length).toBe(17);
    for (let i = 0; i < SECTION_BLOCKS; i++) {
      expect(back.indices[i], `index ${String(i)}`).toBe(i % 17);
    }
  });

  it('packIndices uses 4-bit minimum even for paletteLen=2', () => {
    const idx = new Uint16Array(SECTION_BLOCKS);
    idx[0] = 1;
    const longs = packIndices(idx, 2);
    // 16 indices per long, first index → bit 0 of long 0.
    expect((longs[0] ?? 0n) & 1n).toBe(1n);
    // longs.length = SECTION_BLOCKS / 16 = 256
    expect(longs.length).toBe(256);
  });
});
