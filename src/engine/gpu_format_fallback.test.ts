import { describe, it, expect } from 'vitest';
import { pickFormat, textureBytes, blockSize } from './gpu_format_fallback';

describe('gpu format fallback', () => {
  it('astc preferred', () => {
    expect(pickFormat({ astc: true, etc2: true, bc7: true })).toBe('astc_6x6');
  });

  it('bc7 next', () => {
    expect(pickFormat({ astc: false, etc2: true, bc7: true })).toBe('bc7');
  });

  it('etc2 next', () => {
    expect(pickFormat({ astc: false, etc2: true, bc7: false })).toBe('etc2_rgba');
  });

  it('rgba8 fallback', () => {
    expect(pickFormat({ astc: false, etc2: false, bc7: false })).toBe('rgba8');
  });

  it('bytes scales with area', () => {
    expect(textureBytes('rgba8', 16, 16)).toBe(16 * 16 * 4);
    expect(textureBytes('etc2_rgba', 16, 16)).toBe(16 * 16); // 256 bytes
  });

  it('block sizes', () => {
    expect(blockSize('astc_6x6')).toEqual({ w: 6, h: 6 });
    expect(blockSize('rgba8')).toEqual({ w: 1, h: 1 });
  });
});
