export interface GpuCapabilities {
  webgpu: boolean;
  webgl2: boolean;
  webgl1: boolean;
  astcSupport: boolean;
  etc2Support: boolean;
}

export function rendererChoice(caps: GpuCapabilities): 'webgpu' | 'webgl2' | 'webgl1' | 'canvas_fallback' {
  if (caps.webgpu) return 'webgpu';
  if (caps.webgl2) return 'webgl2';
  if (caps.webgl1) return 'webgl1';
  return 'canvas_fallback';
}

export function textureFormat(caps: GpuCapabilities): 'astc6x6' | 'etc2' | 'rgba8' {
  if (caps.astcSupport) return 'astc6x6';
  if (caps.etc2Support) return 'etc2';
  return 'rgba8';
}
