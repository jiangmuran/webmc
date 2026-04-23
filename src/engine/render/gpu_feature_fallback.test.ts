import { describe, it, expect } from 'vitest';
import { rendererChoice, textureFormat } from './gpu_feature_fallback';

describe('gpu feature fallback', () => {
  it('prefers webgpu', () => {
    expect(
      rendererChoice({
        webgpu: true,
        webgl2: true,
        webgl1: true,
        astcSupport: false,
        etc2Support: false,
      }),
    ).toBe('webgpu');
  });

  it('falls to webgl2', () => {
    expect(
      rendererChoice({
        webgpu: false,
        webgl2: true,
        webgl1: true,
        astcSupport: false,
        etc2Support: false,
      }),
    ).toBe('webgl2');
  });

  it('canvas fallback if nothing', () => {
    expect(
      rendererChoice({
        webgpu: false,
        webgl2: false,
        webgl1: false,
        astcSupport: false,
        etc2Support: false,
      }),
    ).toBe('canvas_fallback');
  });

  it('astc preferred', () => {
    expect(
      textureFormat({
        webgpu: true,
        webgl2: true,
        webgl1: true,
        astcSupport: true,
        etc2Support: false,
      }),
    ).toBe('astc6x6');
  });

  it('rgba8 fallback', () => {
    expect(
      textureFormat({
        webgpu: false,
        webgl2: true,
        webgl1: true,
        astcSupport: false,
        etc2Support: false,
      }),
    ).toBe('rgba8');
  });
});
