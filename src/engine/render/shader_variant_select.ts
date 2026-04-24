export interface DeviceCapabilities {
  webgpu: boolean;
  webgl2: boolean;
  textureCompression: 'astc' | 'etc2' | 'bc' | 'none';
  maxTextureSize: number;
  isMobile: boolean;
}

export type ShaderVariant = 'webgpu_full' | 'webgl2_full' | 'webgl2_lite' | 'webgl2_mobile';

export function pickShader(caps: DeviceCapabilities): ShaderVariant {
  if (caps.webgpu && caps.maxTextureSize >= 8192) return 'webgpu_full';
  if (caps.isMobile) return 'webgl2_mobile';
  if (!caps.webgl2) return 'webgl2_lite';
  return caps.maxTextureSize >= 4096 ? 'webgl2_full' : 'webgl2_lite';
}

export function supportsSmoothLighting(caps: DeviceCapabilities): boolean {
  return caps.webgpu || (caps.webgl2 && !caps.isMobile);
}

export function supportsShadows(caps: DeviceCapabilities): boolean {
  return caps.webgpu;
}
