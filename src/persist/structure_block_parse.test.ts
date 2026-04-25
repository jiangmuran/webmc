import { describe, it, expect } from 'vitest';
import { parseStructureFromNbt, parseStructureBytes } from './structure_block_parse';
import { encodeNbt } from './nbt_encode';
import type { NbtRoot } from './nbt_decode';
import type { NbtValue } from './nbt_compound';

function int(n: number): NbtValue {
  return { type: 'int', value: n };
}
function intList(...xs: number[]): NbtValue {
  return { type: 'list', value: xs.map(int) };
}
function paletteEntry(name: string): NbtValue {
  return { type: 'compound', value: { Name: { type: 'string', value: name } } };
}
function blockEntry(state: number, x: number, y: number, z: number): NbtValue {
  return {
    type: 'compound',
    value: { state: int(state), pos: intList(x, y, z) },
  };
}

describe('Structure block .nbt parser', () => {
  it('extracts size, palette, blocks, dataVersion', () => {
    const root: NbtRoot = {
      name: '',
      value: {
        type: 'compound',
        value: {
          size: intList(3, 2, 4),
          palette: {
            type: 'list',
            value: [paletteEntry('minecraft:air'), paletteEntry('minecraft:stone')],
          },
          blocks: {
            type: 'list',
            value: [blockEntry(1, 0, 0, 0), blockEntry(1, 2, 1, 3)],
          },
          DataVersion: int(3955),
        },
      },
    };
    const s = parseStructureFromNbt(root);
    expect(s.sizeX).toBe(3);
    expect(s.sizeY).toBe(2);
    expect(s.sizeZ).toBe(4);
    expect(s.palette).toEqual([{ name: 'minecraft:air' }, { name: 'minecraft:stone' }]);
    expect(s.blocks).toEqual([
      { paletteIndex: 1, x: 0, y: 0, z: 0 },
      { paletteIndex: 1, x: 2, y: 1, z: 3 },
    ]);
    expect(s.dataVersion).toBe(3955);
  });

  it('round-trips through encodeNbt + parseStructureBytes', () => {
    const root: NbtRoot = {
      name: '',
      value: {
        type: 'compound',
        value: {
          size: intList(1, 1, 1),
          palette: { type: 'list', value: [paletteEntry('minecraft:diamond_block')] },
          blocks: { type: 'list', value: [blockEntry(0, 0, 0, 0)] },
          DataVersion: int(0),
        },
      },
    };
    const bytes = encodeNbt(root);
    const s = parseStructureBytes(bytes);
    expect(s.sizeX).toBe(1);
    expect(s.palette[0]?.name).toBe('minecraft:diamond_block');
    expect(s.blocks[0]).toEqual({ paletteIndex: 0, x: 0, y: 0, z: 0 });
  });

  it('returns empty defaults on a non-compound root', () => {
    const s = parseStructureFromNbt({
      name: '',
      value: { type: 'string', value: 'oops' },
    });
    expect(s.sizeX).toBe(0);
    expect(s.palette).toEqual([]);
    expect(s.blocks).toEqual([]);
  });
});
