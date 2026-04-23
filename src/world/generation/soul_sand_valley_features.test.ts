import { describe, it, expect } from 'vitest';
import { biomeContains, ghastSpawnMultiplier } from './soul_sand_valley_features';

describe('soul sand valley features', () => {
  it('base blocks in biome', () => {
    expect(biomeContains('soul_sand')).toBe(true);
  });

  it('skull decoration', () => {
    expect(biomeContains('wither_skeleton_skull')).toBe(true);
  });

  it('random block no', () => {
    expect(biomeContains('diamond')).toBe(false);
  });

  it('ghast boost', () => {
    expect(ghastSpawnMultiplier()).toBeGreaterThan(1);
  });
});
