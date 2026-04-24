import { describe, it, expect } from 'vitest';
import { packAtlas, atlasCapacity } from './texture_atlas_packer';

describe('texture atlas packer', () => {
  it('fits tiles in UV 0..1', () => {
    const t = packAtlas(['a', 'b', 'c'], 16, 256);
    expect(t.every((x) => x.u >= 0 && x.u + x.size <= 1)).toBe(true);
  });

  it('capacity for 16×256', () => {
    expect(atlasCapacity(16, 256)).toBe(256);
  });

  it('respects capacity', () => {
    const ids = Array.from({ length: 1000 }, (_, i) => `t${i}`);
    const t = packAtlas(ids, 16, 32);
    expect(t.length).toBeLessThanOrEqual(atlasCapacity(16, 32));
  });

  it('identical layout for same input', () => {
    const a = packAtlas(['a', 'b'], 16, 256);
    const b = packAtlas(['a', 'b'], 16, 256);
    expect(a).toEqual(b);
  });
});
