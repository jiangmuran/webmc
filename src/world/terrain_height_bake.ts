// Heightmap bake from noise. Ridged mountains ↔ smooth plains via
// per-biome amplitude + base.

export interface HeightParams {
  base: number;
  amplitude: number;
}

export function heightAt(noise01: number, p: HeightParams): number {
  return Math.floor(p.base + noise01 * p.amplitude);
}

export function sampleHeightField(
  params: HeightParams,
  noise: (x: number, z: number) => number,
  x0: number,
  z0: number,
  w: number,
  h: number,
): Int16Array {
  const out = new Int16Array(w * h);
  for (let z = 0; z < h; z++) {
    for (let x = 0; x < w; x++) {
      out[z * w + x] = heightAt(noise(x0 + x, z0 + z), params);
    }
  }
  return out;
}

export const PLAINS: HeightParams = { base: 64, amplitude: 4 };
export const HILLS: HeightParams = { base: 80, amplitude: 30 };
export const MOUNTAINS: HeightParams = { base: 90, amplitude: 110 };
export const OCEAN: HeightParams = { base: 40, amplitude: 10 };
