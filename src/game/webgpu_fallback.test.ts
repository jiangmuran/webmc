import { describe, it, expect } from 'vitest';
import { pickBackend, meetsMinimum } from './webgpu_fallback';

describe('backend pick', () => {
  it('webgpu when available + flag', () => {
    const b = pickBackend({
      hasWebGPU: true,
      hasWebGL2: true,
      featureFlag: true,
      minimumFeatures: [],
      availableFeatures: new Set(),
    });
    expect(b).toBe('webgpu');
  });

  it('webgl2 fallback', () => {
    const b = pickBackend({
      hasWebGPU: true,
      hasWebGL2: true,
      featureFlag: false,
      minimumFeatures: [],
      availableFeatures: new Set(),
    });
    expect(b).toBe('webgl2');
  });

  it('none when neither', () => {
    expect(
      pickBackend({
        hasWebGPU: false,
        hasWebGL2: false,
        featureFlag: false,
        minimumFeatures: [],
        availableFeatures: new Set(),
      }),
    ).toBe('none');
  });

  it('missing feature drops to webgl2', () => {
    const b = pickBackend({
      hasWebGPU: true,
      hasWebGL2: true,
      featureFlag: true,
      minimumFeatures: ['shader-f16'],
      availableFeatures: new Set(),
    });
    expect(b).toBe('webgl2');
  });

  it('minimum device', () => {
    expect(meetsMinimum({ memoryGB: 4, cores: 4, isMobile: false })).toBe(true);
    expect(meetsMinimum({ memoryGB: 0.25, cores: 4, isMobile: true })).toBe(false);
  });
});
