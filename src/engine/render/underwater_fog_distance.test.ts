import { describe, it, expect } from 'vitest';
import {
  fogColor,
  fogEndDistance,
  oxygenBarVisible,
  type UnderwaterFogInput,
} from './underwater_fog_distance';

const base: UnderwaterFogInput = {
  biome: 'ocean',
  hasRespirationEnchant: false,
  hasConduitPower: false,
};

describe('underwater fog distance', () => {
  it('warm ocean brighter blue-green', () => {
    const [, g, b] = fogColor({ ...base, biome: 'warm_ocean' });
    expect(g).toBeGreaterThan(0.5);
    expect(b).toBeGreaterThan(0.5);
  });

  it('cold ocean dim', () => {
    const [r, g, b] = fogColor({ ...base, biome: 'cold_ocean' });
    expect(r + g + b).toBeLessThan(
      fogColor({ ...base, biome: 'warm_ocean' }).reduce((s, c) => s + c, 0),
    );
  });

  it('respiration extends fog', () => {
    expect(fogEndDistance({ ...base, hasRespirationEnchant: true })).toBeGreaterThan(
      fogEndDistance(base),
    );
  });

  it('conduit power further', () => {
    expect(fogEndDistance({ ...base, hasConduitPower: true })).toBeGreaterThan(
      fogEndDistance({ ...base, hasRespirationEnchant: true }),
    );
  });

  it('conduit hides oxygen bar', () => {
    expect(oxygenBarVisible({ ...base, hasConduitPower: true })).toBe(false);
  });
});
