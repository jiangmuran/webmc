import { describe, it, expect } from 'vitest';
import {
  makeGlowSquid,
  onDamaged,
  isDimmed,
  inkSacDrops,
  canSpawnGlowSquid,
  DIM_TICKS,
} from './glow_squid_dim';

describe('glow squid', () => {
  it('dims on damage', () => {
    const g = makeGlowSquid(20);
    onDamaged(g, 0);
    expect(isDimmed(g, 50)).toBe(true);
    expect(isDimmed(g, DIM_TICKS + 1)).toBe(false);
  });

  it('ink drops 1..3', () => {
    for (let i = 0; i < 20; i++) {
      const n = inkSacDrops(() => i / 20);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(3);
    }
  });

  it('spawn needs dark + low + underwater', () => {
    expect(canSpawnGlowSquid({ y: 20, lightLevel: 0, underwater: true })).toBe(true);
    expect(canSpawnGlowSquid({ y: 20, lightLevel: 5, underwater: true })).toBe(false);
    expect(canSpawnGlowSquid({ y: 60, lightLevel: 0, underwater: true })).toBe(false);
    expect(canSpawnGlowSquid({ y: 20, lightLevel: 0, underwater: false })).toBe(false);
  });

  it('forbidden biomes (wiki: not in deep_dark or sulfur_caves)', () => {
    expect(canSpawnGlowSquid({ y: 20, lightLevel: 0, underwater: true, biome: 'deep_dark' })).toBe(
      false,
    );
    expect(
      canSpawnGlowSquid({ y: 20, lightLevel: 0, underwater: true, biome: 'sulfur_caves' }),
    ).toBe(false);
    expect(canSpawnGlowSquid({ y: 20, lightLevel: 0, underwater: true, biome: 'lush_caves' })).toBe(
      true,
    );
  });
});
