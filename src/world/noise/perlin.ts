// Improved Perlin noise (Ken Perlin, 2002), seeded permutation via mulberry32.
// Algorithm is a public-domain reference; this implementation is original.
// References: Ken Perlin, "Improving Noise" (SIGGRAPH 2002).

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildPermutation(seed: number): Uint8Array {
  const rnd = mulberry32(seed);
  const base = new Uint8Array(256);
  for (let i = 0; i < 256; i++) base[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const a = base[i] ?? 0;
    base[i] = base[j] ?? 0;
    base[j] = a;
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = base[i & 255] ?? 0;
  return p;
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

function grad2(hash: number, x: number, z: number): number {
  const h = hash & 7;
  const u = h < 4 ? x : z;
  const v = h < 4 ? z : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function grad3(hash: number, x: number, y: number, z: number): number {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

export class Perlin {
  private readonly p: Uint8Array;

  constructor(seed: number) {
    this.p = buildPermutation(seed | 0);
  }

  noise2(x: number, z: number): number {
    const xi = Math.floor(x) & 255;
    const zi = Math.floor(z) & 255;
    const xf = x - Math.floor(x);
    const zf = z - Math.floor(z);
    const u = fade(xf);
    const v = fade(zf);
    const a = ((this.p[xi] ?? 0) + zi) & 255;
    const b = ((this.p[xi + 1] ?? 0) + zi) & 255;
    const g00 = grad2(this.p[a] ?? 0, xf, zf);
    const g10 = grad2(this.p[b] ?? 0, xf - 1, zf);
    const g01 = grad2(this.p[(a + 1) & 255] ?? 0, xf, zf - 1);
    const g11 = grad2(this.p[(b + 1) & 255] ?? 0, xf - 1, zf - 1);
    const x1 = lerp(g00, g10, u);
    const x2 = lerp(g01, g11, u);
    return lerp(x1, x2, v);
  }

  noise3(x: number, y: number, z: number): number {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const zi = Math.floor(z) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);
    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);
    const A = ((this.p[xi] ?? 0) + yi) & 255;
    const AA = ((this.p[A] ?? 0) + zi) & 255;
    const AB = ((this.p[(A + 1) & 255] ?? 0) + zi) & 255;
    const B = ((this.p[xi + 1] ?? 0) + yi) & 255;
    const BA = ((this.p[B] ?? 0) + zi) & 255;
    const BB = ((this.p[(B + 1) & 255] ?? 0) + zi) & 255;
    return lerp(
      lerp(
        lerp(grad3(this.p[AA] ?? 0, xf, yf, zf), grad3(this.p[BA] ?? 0, xf - 1, yf, zf), u),
        lerp(grad3(this.p[AB] ?? 0, xf, yf - 1, zf), grad3(this.p[BB] ?? 0, xf - 1, yf - 1, zf), u),
        v,
      ),
      lerp(
        lerp(
          grad3(this.p[(AA + 1) & 255] ?? 0, xf, yf, zf - 1),
          grad3(this.p[(BA + 1) & 255] ?? 0, xf - 1, yf, zf - 1),
          u,
        ),
        lerp(
          grad3(this.p[(AB + 1) & 255] ?? 0, xf, yf - 1, zf - 1),
          grad3(this.p[(BB + 1) & 255] ?? 0, xf - 1, yf - 1, zf - 1),
          u,
        ),
        v,
      ),
      w,
    );
  }

  fbm2(x: number, z: number, octaves: number, persistence = 0.5, lacunarity = 2): number {
    let amp = 1;
    let freq = 1;
    let total = 0;
    let norm = 0;
    for (let o = 0; o < octaves; o++) {
      total += amp * this.noise2(x * freq, z * freq);
      norm += amp;
      amp *= persistence;
      freq *= lacunarity;
    }
    return total / norm;
  }

  fbm3(
    x: number,
    y: number,
    z: number,
    octaves: number,
    persistence = 0.5,
    lacunarity = 2,
  ): number {
    let amp = 1;
    let freq = 1;
    let total = 0;
    let norm = 0;
    for (let o = 0; o < octaves; o++) {
      total += amp * this.noise3(x * freq, y * freq, z * freq);
      norm += amp;
      amp *= persistence;
      freq *= lacunarity;
    }
    return total / norm;
  }
}

export function hash32(x: number, z: number, seed: number): number {
  let h = seed | 0;
  h = Math.imul(h ^ (x | 0), 2654435761);
  h = Math.imul(h ^ (z | 0), 1597334677);
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489917);
  h ^= h >>> 16;
  return h >>> 0;
}
