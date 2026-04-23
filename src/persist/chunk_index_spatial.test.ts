import { describe, it, expect } from 'vitest';
import { chunkKey, parseKey, keysInRange } from './chunk_index_spatial';

describe('chunk index spatial', () => {
  it('key roundtrip', () => {
    expect(parseKey(chunkKey(3, -7))).toEqual({ x: 3, z: -7 });
  });

  it('bad key undefined', () => {
    expect(parseKey('bad')).toBeUndefined();
  });

  it('range size', () => {
    expect(keysInRange(0, 0, 2)).toHaveLength(25);
  });
});
