import { describe, it, expect } from 'vitest';
import { encodeVariant, decodeVariant } from './tropical_fish_variant';

describe('tropical fish variant', () => {
  it('round-trip', () => {
    const v = {
      shape: 'betty' as const,
      pattern: 5,
      bodyColor: 'red' as const,
      patternColor: 'white' as const,
    };
    expect(decodeVariant(encodeVariant(v))).toEqual(v);
  });

  it('encoded fits in u32', () => {
    const e = encodeVariant({
      shape: 'clayfish',
      pattern: 0xff,
      bodyColor: 'blue',
      patternColor: 'orange',
    });
    expect(e).toBeGreaterThanOrEqual(0);
    expect(e).toBeLessThanOrEqual(0xffffffff);
  });

  it('default fallback shape', () => {
    const d = decodeVariant(0);
    expect(['flopper', 'stripey', 'glitter', 'blockfish', 'betty', 'clayfish']).toContain(d.shape);
  });
});
