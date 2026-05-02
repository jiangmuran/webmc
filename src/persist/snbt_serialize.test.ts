import { describe, it, expect } from 'vitest';
import { serializeSnbt } from './snbt_serialize';
import { parseSnbt } from './snbt_parse';
import { snbtValueToNbtValue } from './snbt_to_nbt';
import type { NbtValue } from './nbt_compound';

function nbt(text: string): NbtValue {
  return snbtValueToNbtValue(parseSnbt(text));
}

describe('SNBT serializer', () => {
  it('renders a simple compound', () => {
    const out = serializeSnbt(nbt('{x:1, y:2.5d}'));
    // Re-parse to dodge field-order brittleness.
    const back = nbt(out);
    if (back.type !== 'compound') throw new Error('not compound');
    expect(back.value['x']).toEqual({ type: 'int', value: 1 });
    expect(back.value['y']).toEqual({ type: 'double', value: 2.5 });
  });

  it('quotes keys that contain non-identifier characters', () => {
    const v: NbtValue = {
      type: 'compound',
      value: { 'minecraft:torch': { type: 'byte', value: 1 } },
    };
    const s = serializeSnbt(v);
    expect(s).toContain('"minecraft:torch":1b');
  });

  it('renders typed arrays with correct prefix and suffix', () => {
    const ba: NbtValue = { type: 'byteArray', value: new Int8Array([1, 2, 3]) };
    expect(serializeSnbt(ba)).toBe('[B;1b,2b,3b]');
    const ia: NbtValue = { type: 'intArray', value: new Int32Array([10, 20]) };
    expect(serializeSnbt(ia)).toBe('[I;10,20]');
    const la: NbtValue = { type: 'longArray', value: new BigInt64Array([100n, 200n]) };
    expect(serializeSnbt(la)).toBe('[L;100L,200L]');
  });

  it('round-trips through parseSnbt for primitives + nested', () => {
    const original = nbt('{a:1, b:1.5d, c:"hi", xs:[1,2,3]}');
    const text = serializeSnbt(original);
    const back = nbt(text);
    expect(back).toEqual(original);
  });

  it('escapes embedded quotes and backslashes in strings', () => {
    const v: NbtValue = { type: 'string', value: 'he said "hi" \\here' };
    const s = serializeSnbt(v);
    expect(s).toBe('"he said \\"hi\\" \\\\here"');
  });
});
