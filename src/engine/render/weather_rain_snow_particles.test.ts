import { describe, it, expect } from 'vitest';
import {
  activeWeatherParticles,
  precipitationKind,
} from './weather_rain_snow_particles';

describe('weather rain snow particles', () => {
  const base = {
    isRaining: true,
    isThundering: false,
    biomeTemperature: 0.5,
    y: 80,
    underCeiling: false,
  };

  it('rain emits particles', () => {
    expect(activeWeatherParticles(base)).toBeGreaterThan(0);
  });

  it('ceiling blocks rain', () => {
    expect(activeWeatherParticles({ ...base, underCeiling: true })).toBe(0);
  });

  it('thunder doubles particles', () => {
    expect(activeWeatherParticles({ ...base, isThundering: true })).toBeGreaterThan(
      activeWeatherParticles(base),
    );
  });

  it('cold biome → snow', () => {
    expect(precipitationKind({ ...base, biomeTemperature: -0.5 })).toBe('snow');
  });

  it('warm biome → rain', () => {
    expect(precipitationKind(base)).toBe('rain');
  });

  it('clear → none', () => {
    expect(precipitationKind({ ...base, isRaining: false })).toBe('none');
  });
});
