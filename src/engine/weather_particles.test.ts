import { describe, it, expect } from 'vitest';
import { kindFor, particlesPerSecond, dropVelocity } from './weather_particles';

describe('weather particles', () => {
  it('no rain → none', () => {
    expect(kindFor({ raining: false, intensity: 1, biomeTemperature: 0.8 })).toBe('none');
  });

  it('temperate rain', () => {
    expect(kindFor({ raining: true, intensity: 1, biomeTemperature: 0.8 })).toBe('rain');
  });

  it('cold snow', () => {
    expect(kindFor({ raining: true, intensity: 1, biomeTemperature: 0.0 })).toBe('snow');
  });

  it('hot desert no rain', () => {
    expect(kindFor({ raining: true, intensity: 1, biomeTemperature: 2.0 })).toBe('none');
  });

  it('intensity scales rate', () => {
    const low = particlesPerSecond({ raining: true, intensity: 0.2, biomeTemperature: 0.8 });
    const high = particlesPerSecond({ raining: true, intensity: 1, biomeTemperature: 0.8 });
    expect(high).toBeGreaterThan(low);
  });

  it('snow slower than rain', () => {
    expect(Math.abs(dropVelocity('snow'))).toBeLessThan(Math.abs(dropVelocity('rain')));
  });

  it('none zero vel', () => {
    expect(dropVelocity('none')).toBe(0);
  });
});
