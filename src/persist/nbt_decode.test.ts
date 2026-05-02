import { describe, it, expect } from 'vitest';
import { decodeNbt } from './nbt_decode';

function buildBytes(parts: number[]): Uint8Array {
  return new Uint8Array(parts);
}

function strBytes(s: string): number[] {
  const enc = new TextEncoder().encode(s);
  return [0, enc.length, ...enc];
}

describe('NBT binary decoder', () => {
  it('decodes an empty unnamed compound', () => {
    // tag=END (0)
    const root = decodeNbt(buildBytes([0]));
    expect(root.name).toBe('');
    expect(root.value.type).toBe('compound');
  });

  it('decodes a compound with byte/short/int/string fields', () => {
    // root: TAG_COMPOUND name="root"
    //   "b": TAG_BYTE 7
    //   "s": TAG_SHORT 0x0102
    //   "i": TAG_INT 0x01020304
    //   "n": TAG_STRING "hi"
    //   END
    const bytes = buildBytes([
      10,
      ...strBytes('root'),
      1,
      ...strBytes('b'),
      7,
      2,
      ...strBytes('s'),
      0x01,
      0x02,
      3,
      ...strBytes('i'),
      0x01,
      0x02,
      0x03,
      0x04,
      8,
      ...strBytes('n'),
      ...strBytes('hi'),
      0,
    ]);
    const r = decodeNbt(bytes);
    expect(r.name).toBe('root');
    if (r.value.type !== 'compound') throw new Error('not compound');
    const c = r.value.value;
    expect(c['b']).toEqual({ type: 'byte', value: 7 });
    expect(c['s']).toEqual({ type: 'short', value: 0x0102 });
    expect(c['i']).toEqual({ type: 'int', value: 0x01020304 });
    expect(c['n']).toEqual({ type: 'string', value: 'hi' });
  });

  it('decodes a list of ints', () => {
    // root: COMPOUND "r"
    //   "xs": LIST<INT> [1, 2, 3]
    //   END
    const bytes = buildBytes([
      10,
      ...strBytes('r'),
      9,
      ...strBytes('xs'),
      3, // item tag = INT
      0,
      0,
      0,
      3, // length = 3
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      2,
      0,
      0,
      0,
      3,
      0,
    ]);
    const r = decodeNbt(bytes);
    if (r.value.type !== 'compound') throw new Error('not compound');
    const xs = r.value.value['xs'];
    if (xs?.type !== 'list') throw new Error('xs not list');
    expect(xs.value.length).toBe(3);
    expect(xs.value[0]).toEqual({ type: 'int', value: 1 });
    expect(xs.value[2]).toEqual({ type: 'int', value: 3 });
  });

  it('decodes int and long arrays', () => {
    // COMPOUND "" { "ia": INT_ARRAY [1, 2], "la": LONG_ARRAY [1n] }
    const bytes = buildBytes([
      10,
      ...strBytes(''),
      11,
      ...strBytes('ia'),
      0,
      0,
      0,
      2,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      2,
      12,
      ...strBytes('la'),
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
    ]);
    const r = decodeNbt(bytes);
    if (r.value.type !== 'compound') throw new Error('not compound');
    const ia = r.value.value['ia'];
    if (ia?.type !== 'intArray') throw new Error('ia not intArray');
    expect(Array.from(ia.value)).toEqual([1, 2]);
    const la = r.value.value['la'];
    if (la?.type !== 'longArray') throw new Error('la not longArray');
    expect(la.value.length).toBe(1);
    expect(la.value[0]).toBe(1n);
  });

  it('throws on truncated input', () => {
    expect(() => decodeNbt(new Uint8Array([10, 0, 5, 99]))).toThrow();
  });
});
