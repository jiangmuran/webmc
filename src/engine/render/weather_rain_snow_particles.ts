export interface WeatherCtx {
  isRaining: boolean;
  isThundering: boolean;
  biomeTemperature: number;
  y: number;
  underCeiling: boolean;
}

export const PARTICLE_BASE_RATE = 50;

export function activeWeatherParticles(c: WeatherCtx): number {
  if (!c.isRaining) return 0;
  if (c.underCeiling) return 0;
  const factor = c.isThundering ? 2 : 1;
  return PARTICLE_BASE_RATE * factor;
}

export function precipitationKind(c: WeatherCtx): 'rain' | 'snow' | 'none' {
  if (!c.isRaining) return 'none';
  return c.biomeTemperature < 0.15 ? 'snow' : 'rain';
}
