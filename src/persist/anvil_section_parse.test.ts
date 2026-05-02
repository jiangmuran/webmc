import { describe, it, expect } from 'vitest';
import { parseSection, parseChunkSections, blockIndex } from './anvil_section_parse';
import type { NbtValue } from './nbt_compound';

function paletteEntry(name: string): NbtValue {
  return {
    type: 'compound',
    value: { Name: { type: 'string', value: name } },
  };
}

describe('Anvil section parser', () => {
  it('returns single-entry palette section as all-zero indices', () => {
    const sec: NbtValue = {
      type: 'compound',
      value: {
        block_states: {
          type: 'compound',
          value: {
            palette: { type: 'list', value: [paletteEntry('minecraft:air')] },
          },
        },
      },
    };
    const out = parseSection(sec, 0);
    expect(out).not.toBeNull();
    if (!out) return;
    expect(out.palette[0]?.name).toBe('minecraft:air');
    expect(out.indices.length).toBe(16 * 16 * 16);
    for (const idx of out.indices) expect(idx).toBe(0);
  });

  it('unpacks 4-bit indices from a 2-entry palette', () => {
    // 2-entry palette → bits = max(4, ceil(log2(2))) = 4. 16 indices per long.
    // First long packs indices 0..15 (LSB first). Set first one to 1, rest to 0.
    const data = new BigInt64Array(256); // 4096 / 16 = 256 longs
    data[0] = 1n; // index 0 → 1, all others in this long → 0
    const sec: NbtValue = {
      type: 'compound',
      value: {
        block_states: {
          type: 'compound',
          value: {
            palette: {
              type: 'list',
              value: [paletteEntry('minecraft:air'), paletteEntry('minecraft:stone')],
            },
            data: { type: 'longArray', value: data },
          },
        },
      },
    };
    const out = parseSection(sec, 0);
    expect(out).not.toBeNull();
    if (!out) return;
    expect(out.palette[1]?.name).toBe('minecraft:stone');
    expect(out.indices[0]).toBe(1);
    expect(out.indices[1]).toBe(0);
    expect(out.indices[15]).toBe(0);
  });

  it('parseChunkSections returns one section per Y level', () => {
    const root: NbtValue = {
      type: 'compound',
      value: {
        sections: {
          type: 'list',
          value: [
            {
              type: 'compound',
              value: {
                Y: { type: 'int', value: 0 },
                block_states: {
                  type: 'compound',
                  value: {
                    palette: { type: 'list', value: [paletteEntry('minecraft:stone')] },
                  },
                },
              },
            },
            {
              type: 'compound',
              value: {
                Y: { type: 'int', value: 1 },
                block_states: {
                  type: 'compound',
                  value: {
                    palette: { type: 'list', value: [paletteEntry('minecraft:dirt')] },
                  },
                },
              },
            },
          ],
        },
      },
    };
    const sections = parseChunkSections(root);
    expect(sections.length).toBe(2);
    expect(sections[0]?.y).toBe(0);
    expect(sections[0]?.palette[0]?.name).toBe('minecraft:stone');
    expect(sections[1]?.palette[0]?.name).toBe('minecraft:dirt');
  });

  it('blockIndex matches Anvil ordering Y*256+Z*16+X', () => {
    expect(blockIndex(0, 0, 0)).toBe(0);
    expect(blockIndex(15, 0, 0)).toBe(15);
    expect(blockIndex(0, 0, 1)).toBe(16);
    expect(blockIndex(0, 1, 0)).toBe(256);
    expect(blockIndex(15, 15, 15)).toBe(4095);
  });
});
