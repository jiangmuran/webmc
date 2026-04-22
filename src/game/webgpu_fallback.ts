// WebGPU feature detection + WebGL2 fallback selection. Used at boot
// to pick the renderer backend.

export type Backend = 'webgpu' | 'webgl2' | 'none';

export interface CapsQuery {
  hasWebGPU: boolean;
  hasWebGL2: boolean;
  featureFlag: boolean;
  minimumFeatures: string[]; // required feature names for WebGPU
  availableFeatures: Set<string>;
}

export function pickBackend(q: CapsQuery): Backend {
  if (q.featureFlag && q.hasWebGPU) {
    const allPresent = q.minimumFeatures.every((f) => q.availableFeatures.has(f));
    if (allPresent) return 'webgpu';
  }
  if (q.hasWebGL2) return 'webgl2';
  return 'none';
}

// "is webmc supported on this device" lower-bar check.
export interface MinDeviceQuery {
  memoryGB: number | null;
  cores: number;
  isMobile: boolean;
}

export function meetsMinimum(q: MinDeviceQuery): boolean {
  if (q.cores < 1) return false;
  if (q.memoryGB !== null && q.memoryGB < 0.5) return false;
  return true;
}
