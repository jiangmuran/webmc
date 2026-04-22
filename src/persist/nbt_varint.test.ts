import { describe, it, expect } from 'vitest';
import { encodeVarint, decodeVarint, varintSize } from './nbt_varint';

describe('nbt varint', () => {
  it('encodes 0 as one byte', () => {
    expect(encodeVarint(0)).toEqual([0]);
  });

  it('encodes 127 as one byte', () => {
    expect(encodeVarint(127)).toEqual([127]);
  });

  it('encodes 128 as two bytes', () => {
    expect(encodeVarint(128)).toEqual([0x80, 1]);
  });

  it('round-trips', () => {
    for (const n of [0, 1, 127, 128, 1000, 16384, 100000, 1e6]) {
      const bytes = encodeVarint(n);
      expect(decodeVarint(bytes).value).toBe(n);
    }
  });

  it('varintSize matches', () => {
    expect(varintSize(300)).toBe(2);
    expect(varintSize(0)).toBe(1);
  });

  it('negative rejected', () => {
    expect(() => encodeVarint(-1)).toThrow();
  });

  it('truncated rejected', () => {
    expect(() => decodeVarint([0x80])).toThrow();
  });
});
