import { describe, it, expect } from 'vitest';
import { parseSnbt } from './snbt_parse';
import { snbtValueToNbtValue } from './snbt_to_nbt';
import { encodeNbt } from './nbt_encode';
import { decodeNbt } from './nbt_decode';

describe('SNBT → NBT bridge', () => {
  it('converts a compound and round-trips through encode/decode', () => {
    const snbt = parseSnbt('{x:1, y:2.5d, name:"webmc:torch", flags:[1b,0b,1b]}');
    const nbt = snbtValueToNbtValue(snbt);
    expect(nbt.type).toBe('compound');
    if (nbt.type !== 'compound') return;
    const enc = encodeNbt({ name: '', value: nbt });
    const back = decodeNbt(enc);
    expect(back.value).toEqual(nbt);
  });

  it('preserves all numeric subtypes', () => {
    const snbt = parseSnbt('{b:7b, s:300s, i:-99, l:1234567890123L, f:1.5f, d:3.14}');
    const nbt = snbtValueToNbtValue(snbt);
    if (nbt.type !== 'compound') throw new Error('not compound');
    expect(nbt.value['b']).toEqual({ type: 'byte', value: 7 });
    expect(nbt.value['s']).toEqual({ type: 'short', value: 300 });
    expect(nbt.value['i']).toEqual({ type: 'int', value: -99 });
    expect(nbt.value['l']).toEqual({ type: 'long', value: 1234567890123n });
    expect(nbt.value['f']).toEqual({ type: 'float', value: 1.5 });
    expect(nbt.value['d']).toEqual({ type: 'double', value: 3.14 });
  });

  it('converts nested lists', () => {
    const snbt = parseSnbt('{matrix:[[1,2],[3,4]]}');
    const nbt = snbtValueToNbtValue(snbt);
    if (nbt.type !== 'compound') throw new Error('not compound');
    const m = nbt.value['matrix'];
    if (m?.type !== 'list') throw new Error('matrix not list');
    expect(m.value.length).toBe(2);
    if (m.value[0]?.type !== 'list') throw new Error('row not list');
    expect(m.value[0].value).toEqual([
      { type: 'int', value: 1 },
      { type: 'int', value: 2 },
    ]);
  });
});
