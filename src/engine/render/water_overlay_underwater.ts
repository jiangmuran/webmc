export function waterFogColor(
  biome: 'ocean' | 'warm_ocean' | 'cold_ocean' | 'swamp' | 'default',
): [number, number, number] {
  if (biome === 'warm_ocean') return [0.26, 0.85, 0.95];
  if (biome === 'cold_ocean') return [0.15, 0.3, 0.45];
  if (biome === 'swamp') return [0.24, 0.25, 0.11];
  if (biome === 'ocean') return [0.24, 0.4, 0.6];
  return [0.2, 0.3, 0.5];
}

export function waterFogDensity(depth: number): number {
  return Math.min(1, 0.02 + 0.002 * Math.max(0, depth));
}

export function waterDistortionStrength(submerged: boolean): number {
  return submerged ? 0.15 : 0;
}
