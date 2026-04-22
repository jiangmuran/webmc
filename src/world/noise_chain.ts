// Simple fractal noise chain. Layers octaves of a base noise function
// with lacunarity/persistence controls. Used for height, cave, biome.

export interface Octave {
  frequency: number;
  amplitude: number;
}

export interface FractalConfig {
  octaves: number;
  baseFrequency: number;
  lacunarity: number;
  persistence: number;
  seed: number;
}

export function buildOctaves(cfg: FractalConfig): Octave[] {
  const out: Octave[] = [];
  let f = cfg.baseFrequency;
  let a = 1;
  for (let i = 0; i < cfg.octaves; i++) {
    out.push({ frequency: f, amplitude: a });
    f *= cfg.lacunarity;
    a *= cfg.persistence;
  }
  return out;
}

export function maxAmplitudeSum(octs: Octave[]): number {
  return octs.reduce((s, o) => s + o.amplitude, 0);
}

export function sampleFractal(
  octs: Octave[],
  base: (x: number, y: number) => number, // ∈[-1,1]
  x: number,
  y: number,
): number {
  let sum = 0;
  for (const o of octs) {
    sum += o.amplitude * base(x * o.frequency, y * o.frequency);
  }
  const denom = maxAmplitudeSum(octs);
  return denom === 0 ? 0 : sum / denom;
}
