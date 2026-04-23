// 2D value noise with bilinear interpolation. Deterministic per seed.

function hash2(seed: number, x: number, y: number): number {
  let h = seed >>> 0;
  h = Math.imul(h ^ x, 2654435761) >>> 0;
  h = Math.imul(h ^ y, 40503) >>> 0;
  h ^= h >>> 16;
  return (h >>> 0) / 0x100000000;
}

export function valueNoise2D(seed: number, x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const a = hash2(seed, x0, y0);
  const b = hash2(seed, x0 + 1, y0);
  const c = hash2(seed, x0, y0 + 1);
  const d = hash2(seed, x0 + 1, y0 + 1);
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const ab = a + (b - a) * u;
  const cd = c + (d - c) * u;
  return ab + (cd - ab) * v;
}

export function fbm2D(seed: number, x: number, y: number, octaves = 4, persistence = 0.5): number {
  let amp = 1;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += valueNoise2D(seed + i, x * freq, y * freq) * amp;
    norm += amp;
    amp *= persistence;
    freq *= 2;
  }
  return sum / norm;
}
