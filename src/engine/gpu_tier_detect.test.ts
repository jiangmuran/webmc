import { describe, it, expect } from 'vitest';
import { classify, recommendedChunkRadius } from './gpu_tier_detect';

describe('gpu tier detect', () => {
  it('RTX → high', () => {
    expect(
      classify({
        rendererName: 'NVIDIA RTX 4090',
        maxTextureSize: 16384,
        webgpuAvailable: true,
        instancedArrays: true,
      }),
    ).toBe('high');
  });

  it('GTX → mid', () => {
    expect(
      classify({
        rendererName: 'NVIDIA GTX 1660',
        maxTextureSize: 16384,
        webgpuAvailable: false,
        instancedArrays: true,
      }),
    ).toBe('mid');
  });

  it('Mali-G51 low', () => {
    expect(
      classify({
        rendererName: 'Mali-G51',
        maxTextureSize: 4096,
        webgpuAvailable: false,
        instancedArrays: true,
      }),
    ).toBe('low');
  });

  it('high tex size → mid', () => {
    expect(
      classify({
        rendererName: 'Unknown',
        maxTextureSize: 16384,
        webgpuAvailable: false,
        instancedArrays: true,
      }),
    ).toBe('mid');
  });

  it('radius high desktop 16', () => {
    expect(recommendedChunkRadius('high', true)).toBe(16);
  });

  it('radius low mobile 4', () => {
    expect(recommendedChunkRadius('low', false)).toBe(4);
  });
});
