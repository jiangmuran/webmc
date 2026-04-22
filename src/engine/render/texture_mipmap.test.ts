import { describe, it, expect } from 'vitest';
import { generateMipChain, makeTexture, mipmapLevelCount } from './texture_mipmap';

describe('texture mipmap', () => {
  it('level count for 16×16 is 5', () => {
    expect(mipmapLevelCount(16)).toBe(5);
  });

  it('level count for 64 is 7', () => {
    expect(mipmapLevelCount(64)).toBe(7);
  });

  it('chain length = level count', () => {
    const tex = makeTexture(16, 16);
    expect(generateMipChain(tex).length).toBe(5);
  });

  it('each level is half the previous', () => {
    const tex = makeTexture(8, 8);
    const chain = generateMipChain(tex);
    expect(chain[0]?.width).toBe(8);
    expect(chain[1]?.width).toBe(4);
    expect(chain[2]?.width).toBe(2);
    expect(chain[3]?.width).toBe(1);
  });

  it('solid red 2×2 reduces to solid red 1×1', () => {
    const tex = makeTexture(2, 2);
    for (let i = 0; i < 4; i++) {
      tex.data[i * 4] = 255;
      tex.data[i * 4 + 3] = 255;
    }
    const [, level1] = generateMipChain(tex);
    expect(level1?.data[0]).toBe(255);
    expect(level1?.data[3]).toBe(255);
  });

  it('rejects non-power-of-two', () => {
    expect(() => makeTexture(3, 3)).toThrow();
  });

  it('transparent pixel ignored in color average', () => {
    const tex = makeTexture(2, 2);
    // 3 red opaque + 1 blue transparent
    for (let i = 0; i < 3; i++) {
      tex.data[i * 4] = 255;
      tex.data[i * 4 + 3] = 255;
    }
    tex.data[12] = 0;
    tex.data[13] = 0;
    tex.data[14] = 255;
    tex.data[15] = 0;
    const [, l1] = generateMipChain(tex);
    expect(l1?.data[0]).toBe(255); // red dominates
    expect(l1?.data[2]).toBe(0); // blue suppressed
  });
});
