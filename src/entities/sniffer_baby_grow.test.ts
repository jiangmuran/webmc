import { describe, it, expect } from 'vitest';
import {
  shouldHatch,
  isBabyGrown,
  hatchSpeedMultInWarmBiome,
  GROW_TICKS,
  EGG_HATCH_TICKS,
} from './sniffer_baby_grow';

describe('sniffer baby grow', () => {
  it('hatches at threshold', () => {
    expect(shouldHatch({ ageTicks: EGG_HATCH_TICKS })).toBe(true);
  });

  it('young egg no hatch', () => {
    expect(shouldHatch({ ageTicks: 0 })).toBe(false);
  });

  it('baby grown at threshold', () => {
    expect(isBabyGrown({ ageTicks: GROW_TICKS })).toBe(true);
  });

  it('warm biome faster', () => {
    expect(hatchSpeedMultInWarmBiome(true)).toBeGreaterThan(hatchSpeedMultInWarmBiome(false));
  });

  it('GROW_TICKS = 48000 (wiki: 40 minutes, 2× normal baby)', () => {
    expect(GROW_TICKS).toBe(48000);
  });

  it('EGG_HATCH_TICKS = 24000 (wiki: 20 min default, non-moss)', () => {
    expect(EGG_HATCH_TICKS).toBe(24000);
  });
});
