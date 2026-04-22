import { describe, it, expect } from 'vitest';
import { fogFor } from './fog_lut_compute';

describe('fog LUT', () => {
  it('end is purple-ish', () => {
    const f = fogFor({
      timeOfDay: 0,
      weather: 'clear',
      biomeTemperature: 1,
      inNether: false,
      inEnd: true,
      underwater: false,
    });
    expect(f.color.b).toBeGreaterThan(f.color.g);
  });

  it('nether red short range', () => {
    const f = fogFor({
      timeOfDay: 0,
      weather: 'clear',
      biomeTemperature: 1,
      inNether: true,
      inEnd: false,
      underwater: false,
    });
    expect(f.color.r).toBeGreaterThan(f.color.b);
    expect(f.farDistance).toBeLessThan(100);
  });

  it('rain dims color', () => {
    const clear = fogFor({
      timeOfDay: 6000,
      weather: 'clear',
      biomeTemperature: 1,
      inNether: false,
      inEnd: false,
      underwater: false,
    });
    const rain = fogFor({
      timeOfDay: 6000,
      weather: 'rain',
      biomeTemperature: 1,
      inNether: false,
      inEnd: false,
      underwater: false,
    });
    expect(rain.color.r).toBeLessThan(clear.color.r);
  });

  it('underwater blue', () => {
    const f = fogFor({
      timeOfDay: 6000,
      weather: 'clear',
      biomeTemperature: 1,
      inNether: false,
      inEnd: false,
      underwater: true,
    });
    expect(f.color.b).toBeGreaterThan(f.color.r);
  });

  it('night darker', () => {
    const day = fogFor({
      timeOfDay: 6000,
      weather: 'clear',
      biomeTemperature: 1,
      inNether: false,
      inEnd: false,
      underwater: false,
    });
    const night = fogFor({
      timeOfDay: 18000,
      weather: 'clear',
      biomeTemperature: 1,
      inNether: false,
      inEnd: false,
      underwater: false,
    });
    expect(night.color.r).toBeLessThan(day.color.r);
  });
});
