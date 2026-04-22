import { describe, it, expect } from 'vitest';
import { canRainInBiome, forceWeather, makeWeather, tickWeather } from './weather_transitions';

describe('weather', () => {
  it('starts clear', () => {
    expect(makeWeather().state).toBe('clear');
  });

  it('transitions after timer', () => {
    const m = makeWeather();
    m.secondsUntilChange = 0;
    const r = tickWeather(m, 0, () => 0.5);
    expect(r.transitioned).toBe(true);
  });

  it('thunder on low rng', () => {
    const m = makeWeather();
    m.secondsUntilChange = 0;
    tickWeather(m, 0, () => 0.01);
    expect(m.state).toBe('thunder');
  });

  it('rain on high rng (still clearing roll)', () => {
    const m = makeWeather();
    m.secondsUntilChange = 0;
    tickWeather(m, 0, () => 0.9);
    expect(m.state).toBe('rain');
  });

  it('rain transitions back to clear', () => {
    const m = makeWeather();
    forceWeather(m, 'rain', 0);
    tickWeather(m, 0, () => 0.5);
    expect(m.state).toBe('clear');
  });

  it('desert cannot rain', () => {
    expect(canRainInBiome('desert')).toBe(false);
    expect(canRainInBiome('plains')).toBe(true);
  });

  it('forceWeather sets timer', () => {
    const m = makeWeather();
    forceWeather(m, 'thunder', 600);
    expect(m.state).toBe('thunder');
    expect(m.secondsUntilChange).toBe(600);
  });
});
