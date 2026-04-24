import { describe, it, expect } from 'vitest';
import {
  caveStartsInChunk,
  canyonStartsInChunk,
  noodleCaveWidth,
  cheeseCaveDensity,
} from './carver_cave_noise';

describe('carver cave noise', () => {
  it('caves are more common', () => {
    expect(caveStartsInChunk({ chunkX: 0, chunkZ: 0, worldSeed: 0, rng: () => 0.05 })).toBe(true);
  });

  it('canyons are rare', () => {
    expect(canyonStartsInChunk({ chunkX: 0, chunkZ: 0, worldSeed: 0, rng: () => 0.05 })).toBe(
      false,
    );
    expect(canyonStartsInChunk({ chunkX: 0, chunkZ: 0, worldSeed: 0, rng: () => 0.01 })).toBe(true);
  });

  it('noodle width positive', () => {
    expect(noodleCaveWidth(0, () => 0.5)).toBeGreaterThan(0);
  });

  it('no cheese above y=0', () => {
    expect(cheeseCaveDensity(50)).toBe(0);
  });

  it('deep cheese denser', () => {
    expect(cheeseCaveDensity(-60)).toBeGreaterThan(cheeseCaveDensity(-10));
  });
});
