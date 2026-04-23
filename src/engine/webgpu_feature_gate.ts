// WebGPU feature gate. WebGPU is feature-flagged; adapters with
// missing required features fall back to WebGL2.

export interface WebgpuAdapter {
  hasWebgpu: boolean;
  supportsTimestampQuery: boolean;
  supportsShaderF16: boolean;
  limitsMaxBufferSize: number;
}

export const REQUIRED_BUFFER_SIZE = 128 * 1024 * 1024;

export function canUseWebgpu(a: WebgpuAdapter, featureFlagEnabled: boolean): boolean {
  if (!featureFlagEnabled) return false;
  if (!a.hasWebgpu) return false;
  return a.limitsMaxBufferSize >= REQUIRED_BUFFER_SIZE;
}

export function preferredBackend(
  a: WebgpuAdapter,
  featureFlagEnabled: boolean,
): 'webgpu' | 'webgl2' {
  return canUseWebgpu(a, featureFlagEnabled) ? 'webgpu' : 'webgl2';
}

export function optionalFeatureList(a: WebgpuAdapter): string[] {
  const out: string[] = [];
  if (a.supportsTimestampQuery) out.push('timestamp-query');
  if (a.supportsShaderF16) out.push('shader-f16');
  return out;
}
