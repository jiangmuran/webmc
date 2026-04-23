// Weather particles: rain and snow. Spawn rate scales with intensity.
// Rain respects biome (no rain in desert); snow requires cold biome.

export interface WeatherCtx {
  raining: boolean;
  intensity: number; // 0..1
  biomeTemperature: number;
}

export type WeatherParticleKind = 'rain' | 'snow' | 'none';

export function kindFor(c: WeatherCtx): WeatherParticleKind {
  if (!c.raining) return 'none';
  if (c.biomeTemperature < 0.15) return 'snow';
  if (c.biomeTemperature >= 1.5) return 'none'; // hot biomes don't rain
  return 'rain';
}

export const RAIN_PARTICLES_PER_SECOND_AT_FULL = 200;
export const SNOW_PARTICLES_PER_SECOND_AT_FULL = 100;

export function particlesPerSecond(c: WeatherCtx): number {
  const kind = kindFor(c);
  const base =
    kind === 'rain'
      ? RAIN_PARTICLES_PER_SECOND_AT_FULL
      : kind === 'snow'
        ? SNOW_PARTICLES_PER_SECOND_AT_FULL
        : 0;
  return base * Math.max(0, Math.min(1, c.intensity));
}

export function dropVelocity(kind: WeatherParticleKind): number {
  if (kind === 'rain') return -6; // blocks/sec
  if (kind === 'snow') return -1.5;
  return 0;
}
