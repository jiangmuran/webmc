export interface OctaveParams {
  octaves: number;
  lacunarity: number;
  gain: number;
  baseFrequency: number;
}

export function octaveNoise(
  base: (x: number, y: number) => number,
  p: OctaveParams,
  x: number,
  y: number,
): number {
  let sum = 0;
  let amp = 1;
  let freq = p.baseFrequency;
  let norm = 0;
  for (let i = 0; i < p.octaves; i++) {
    sum += base(x * freq, y * freq) * amp;
    norm += amp;
    amp *= p.gain;
    freq *= p.lacunarity;
  }
  return norm === 0 ? 0 : sum / norm;
}
