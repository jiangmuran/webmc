export interface NoiseOctave {
  amplitude: number;
  frequency: number;
  sample: (x: number, y: number, z: number) => number;
}

export function combineOctaves(
  octaves: readonly NoiseOctave[],
  x: number,
  y: number,
  z: number,
): number {
  let total = 0;
  let maxAmp = 0;
  for (const o of octaves) {
    total += o.sample(x * o.frequency, y * o.frequency, z * o.frequency) * o.amplitude;
    maxAmp += Math.abs(o.amplitude);
  }
  return maxAmp === 0 ? 0 : total / maxAmp;
}

export function persistenceOctaves(
  base: NoiseOctave['sample'],
  count: number,
  persistence: number,
): readonly NoiseOctave[] {
  const octaves: NoiseOctave[] = [];
  let amp = 1;
  let freq = 1;
  for (let i = 0; i < count; i++) {
    octaves.push({ amplitude: amp, frequency: freq, sample: base });
    amp *= persistence;
    freq *= 2;
  }
  return octaves;
}
