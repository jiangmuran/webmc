import { describe, it, expect } from 'vitest';
import {
  pickShader,
  supportsSmoothLighting,
  supportsShadows,
  type DeviceCapabilities,
} from './shader_variant_select';

const highEnd: DeviceCapabilities = {
  webgpu: true,
  webgl2: true,
  textureCompression: 'bc',
  maxTextureSize: 16384,
  isMobile: false,
};

const phone: DeviceCapabilities = {
  webgpu: false,
  webgl2: true,
  textureCompression: 'etc2',
  maxTextureSize: 2048,
  isMobile: true,
};

describe('shader variant select', () => {
  it('high end picks webgpu', () => {
    expect(pickShader(highEnd)).toBe('webgpu_full');
  });

  it('phone picks mobile variant', () => {
    expect(pickShader(phone)).toBe('webgl2_mobile');
  });

  it('shadows only on webgpu', () => {
    expect(supportsShadows(highEnd)).toBe(true);
    expect(supportsShadows(phone)).toBe(false);
  });

  it('smooth lighting desktop webgl2', () => {
    const d: DeviceCapabilities = { ...phone, isMobile: false };
    expect(supportsSmoothLighting(d)).toBe(true);
  });

  it('no webgl2 gets lite', () => {
    const legacy: DeviceCapabilities = {
      webgpu: false,
      webgl2: false,
      textureCompression: 'none',
      maxTextureSize: 1024,
      isMobile: false,
    };
    expect(pickShader(legacy)).toBe('webgl2_lite');
  });
});
