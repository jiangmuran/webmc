import { describe, it, expect } from 'vitest';
import { nextWeather, rollDuration, CLEAR_MIN, THUNDER_MAX } from './weather_cycle';

describe('weather cycle', () => {
  it('clear usually leads to rain', () => {
    expect(nextWeather('clear', () => 0)).toBe('rain');
  });

  it('thunder always back to rain', () => {
    expect(nextWeather('thunder', () => 0)).toBe('rain');
  });

  it('clear duration at least minimum', () => {
    expect(rollDuration('clear', () => 0)).toBe(CLEAR_MIN);
  });

  it('thunder duration in range', () => {
    const d = rollDuration('thunder', () => 0.99);
    expect(d).toBeLessThanOrEqual(THUNDER_MAX);
  });
});
