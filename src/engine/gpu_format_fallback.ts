// Texture format fallback. Pick the most compressed texture format
// supported by the device; fall back to RGBA8 worst-case.

export type GpuFormat = 'astc_6x6' | 'etc2_rgba' | 'bc7' | 'rgba8';

export interface GpuSupport {
  astc: boolean;
  etc2: boolean;
  bc7: boolean;
}

export function pickFormat(s: GpuSupport): GpuFormat {
  if (s.astc) return 'astc_6x6';
  if (s.bc7) return 'bc7';
  if (s.etc2) return 'etc2_rgba';
  return 'rgba8';
}

export function bytesPerBlock(f: GpuFormat): number {
  if (f === 'astc_6x6') return 16; // 16 bytes per 6x6 block
  if (f === 'etc2_rgba') return 16;
  if (f === 'bc7') return 16;
  return 4; // rgba8 is per pixel; treated as 1x1 "block"
}

export function blockSize(f: GpuFormat): { w: number; h: number } {
  if (f === 'astc_6x6') return { w: 6, h: 6 };
  if (f === 'etc2_rgba') return { w: 4, h: 4 };
  if (f === 'bc7') return { w: 4, h: 4 };
  return { w: 1, h: 1 };
}

export function textureBytes(f: GpuFormat, w: number, h: number): number {
  const { w: bw, h: bh } = blockSize(f);
  const blocks = Math.ceil(w / bw) * Math.ceil(h / bh);
  return blocks * bytesPerBlock(f);
}
