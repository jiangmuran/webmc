// Texture mipmap generation. Given a square RGBA8 texture, produce a
// chain of 2×-downsampled levels down to 1×1. Each level averages 2×2
// pixels of the level above. Transparent pixels are ignored to avoid
// colored fringing at alpha edges (the "alpha dilation" trick).

export interface RgbaTexture {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export function makeTexture(width: number, height: number): RgbaTexture {
  if (!isPow2(width) || width !== height) {
    throw new Error(`texture must be square power-of-two, got ${width}×${height}`);
  }
  return { width, height, data: new Uint8ClampedArray(width * height * 4) };
}

function isPow2(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

export function mipmapLevelCount(size: number): number {
  return Math.floor(Math.log2(size)) + 1;
}

// Build the mip chain. The first entry is the input; subsequent entries
// are each half the size until 1×1.
export function generateMipChain(base: RgbaTexture): RgbaTexture[] {
  if (!isPow2(base.width) || base.width !== base.height) {
    throw new Error('base must be square power-of-two');
  }
  const chain: RgbaTexture[] = [base];
  let cur = base;
  while (cur.width > 1) {
    cur = downsample2x(cur);
    chain.push(cur);
  }
  return chain;
}

function downsample2x(src: RgbaTexture): RgbaTexture {
  const w = src.width >> 1;
  const dst: RgbaTexture = {
    width: w,
    height: w,
    data: new Uint8ClampedArray(w * w * 4),
  };
  for (let y = 0; y < w; y++) {
    for (let x = 0; x < w; x++) {
      const sx = x << 1;
      const sy = y << 1;
      const i00 = (sy * src.width + sx) * 4;
      const i01 = (sy * src.width + sx + 1) * 4;
      const i10 = ((sy + 1) * src.width + sx) * 4;
      const i11 = ((sy + 1) * src.width + sx + 1) * 4;
      // Alpha-weighted average to suppress edge fringing.
      let rs = 0,
        gs = 0,
        bs = 0,
        as = 0,
        wsum = 0;
      for (const idx of [i00, i01, i10, i11]) {
        const a = src.data[idx + 3] ?? 0;
        rs += (src.data[idx] ?? 0) * a;
        gs += (src.data[idx + 1] ?? 0) * a;
        bs += (src.data[idx + 2] ?? 0) * a;
        as += a;
        wsum += a;
      }
      const di = (y * w + x) * 4;
      if (wsum > 0) {
        dst.data[di] = rs / wsum;
        dst.data[di + 1] = gs / wsum;
        dst.data[di + 2] = bs / wsum;
      }
      dst.data[di + 3] = as / 4;
    }
  }
  return dst;
}
