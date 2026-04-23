import { describe, it, expect } from 'vitest';
import { encodeVarInt, decodeVarInt } from './packet_bitpack_encode';

describe('packet bitpack varint', () => {
  it('zero one byte', () => {
    expect(encodeVarInt(0)).toEqual(new Uint8Array([0]));
  });

  it('127 one byte', () => {
    expect(encodeVarInt(127)).toEqual(new Uint8Array([0x7f]));
  });

  it('128 two bytes', () => {
    const e = encodeVarInt(128);
    expect(e).toHaveLength(2);
  });

  it('round-trip small', () => {
    for (const v of [0, 1, 42, 127, 128, 16383, 16384, 1000000]) {
      const e = encodeVarInt(v);
      expect(decodeVarInt(e, 0).value).toBe(v);
    }
  });

  it('decoder reports bytes read', () => {
    const e = encodeVarInt(500);
    const r = decodeVarInt(e, 0);
    expect(r.bytesRead).toBe(e.length);
  });
});
