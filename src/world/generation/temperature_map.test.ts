import { describe, it, expect } from 'vitest';
import { adjustedTemp, isSnowAt, SEA_LEVEL } from './temperature_map';

describe('temperature map', () => {
  it('below sea level unchanged', () => {
    expect(adjustedTemp({ biomeTemp: 0.5, y: 0 })).toBe(0.5);
  });

  it('mountain cooler than sea level', () => {
    expect(adjustedTemp({ biomeTemp: 0.5, y: SEA_LEVEL + 100 })).toBeLessThan(0.5);
  });

  it('tall cold biome snows', () => {
    expect(isSnowAt({ biomeTemp: 0.2, y: SEA_LEVEL + 200 })).toBe(true);
  });

  it('warm biome no snow', () => {
    expect(isSnowAt({ biomeTemp: 1.5, y: 60 })).toBe(false);
  });
});
