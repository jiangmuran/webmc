import { describe, it, expect } from 'vitest';
import {
  canUseWebgpu,
  preferredBackend,
  optionalFeatureList,
  REQUIRED_BUFFER_SIZE,
} from './webgpu_feature_gate';

const solid = {
  hasWebgpu: true,
  supportsTimestampQuery: true,
  supportsShaderF16: false,
  limitsMaxBufferSize: REQUIRED_BUFFER_SIZE,
};

describe('webgpu feature gate', () => {
  it('flag off → no webgpu', () => {
    expect(canUseWebgpu(solid, false)).toBe(false);
  });

  it('no webgpu adapter', () => {
    expect(canUseWebgpu({ ...solid, hasWebgpu: false }, true)).toBe(false);
  });

  it('insufficient buffer', () => {
    expect(canUseWebgpu({ ...solid, limitsMaxBufferSize: 1 }, true)).toBe(false);
  });

  it('ok path', () => {
    expect(canUseWebgpu(solid, true)).toBe(true);
    expect(preferredBackend(solid, true)).toBe('webgpu');
  });

  it('fallback webgl2', () => {
    expect(preferredBackend(solid, false)).toBe('webgl2');
  });

  it('optional features list', () => {
    expect(optionalFeatureList(solid)).toContain('timestamp-query');
    expect(optionalFeatureList(solid)).not.toContain('shader-f16');
  });
});
