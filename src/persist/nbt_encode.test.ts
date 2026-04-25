import { describe, it, expect } from 'vitest';
import { encodeNbt } from './nbt_encode';
import { decodeNbt, type NbtRoot } from './nbt_decode';
import type { NbtValue } from './nbt_compound';

function roundtrip(root: NbtRoot): NbtRoot {
  const enc = encodeNbt(root);
  return decodeNbt(enc);
}

describe('NBT encode round-trip', () => {
  it('round-trips primitives in a compound', () => {
    const root: NbtRoot = {
      name: 'r',
      value: {
        type: 'compound',
        value: {
          b: { type: 'byte', value: -7 },
          s: { type: 'short', value: 12345 },
          i: { type: 'int', value: 0x01020304 },
          l: { type: 'long', value: 9876543210n },
          f: { type: 'float', value: 1.5 },
          d: { type: 'double', value: 3.141592653589793 },
          str: { type: 'string', value: 'hello world' },
        },
      },
    };
    const back = roundtrip(root);
    expect(back).toEqual(root);
  });

  it('round-trips nested lists and compounds', () => {
    const root: NbtRoot = {
      name: '',
      value: {
        type: 'compound',
        value: {
          xs: {
            type: 'list',
            value: [
              { type: 'int', value: 1 },
              { type: 'int', value: 2 },
              { type: 'int', value: 3 },
            ],
          },
          inner: {
            type: 'compound',
            value: {
              ok: { type: 'byte', value: 1 },
              name: { type: 'string', value: 'minecraft:stone' },
            },
          },
        },
      },
    };
    expect(roundtrip(root)).toEqual(root);
  });

  it('round-trips byte/int/long arrays', () => {
    const root: NbtRoot = {
      name: '',
      value: {
        type: 'compound',
        value: {
          ba: { type: 'byteArray', value: new Int8Array([1, -1, 127, -128]) },
          ia: { type: 'intArray', value: new Int32Array([1, 2, 3, -4]) },
          la: { type: 'longArray', value: new BigInt64Array([1n, 2n, 9999999999n]) },
        },
      },
    };
    const back = roundtrip(root);
    if (back.value.type !== 'compound') throw new Error('not compound');
    const ba = back.value.value['ba'];
    if (ba?.type !== 'byteArray') throw new Error('ba');
    expect(Array.from(ba.value)).toEqual([1, -1, 127, -128]);
    const ia = back.value.value['ia'];
    if (ia?.type !== 'intArray') throw new Error('ia');
    expect(Array.from(ia.value)).toEqual([1, 2, 3, -4]);
    const la = back.value.value['la'];
    if (la?.type !== 'longArray') throw new Error('la');
    expect(la.value.length).toBe(3);
    expect(la.value[2]).toBe(9999999999n);
  });

  it('encodes an empty list as item-tag END', () => {
    const empty: NbtValue = { type: 'list', value: [] };
    const root: NbtRoot = { name: '', value: { type: 'compound', value: { xs: empty } } };
    const back = roundtrip(root);
    if (back.value.type !== 'compound') throw new Error('not compound');
    const xs = back.value.value['xs'];
    if (xs?.type !== 'list') throw new Error('xs not list');
    expect(xs.value.length).toBe(0);
  });
});
