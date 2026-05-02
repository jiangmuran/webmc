import { describe, it, expect } from 'vitest';
import {
  shouldHatch,
  isBabyGrown,
  hatchSpeedMultInWarmBiome,
  hatchSpeedMultOnMoss,
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

  it('moss block hatches 2× faster (wiki)', () => {
    // Wiki minecraft.wiki/w/Sniffer_Egg: "10 minutes on moss, 20
    // minutes elsewhere" → 2× speedup on moss.
    expect(hatchSpeedMultOnMoss(true)).toBe(2);
    expect(hatchSpeedMultOnMoss(false)).toBe(1);
  });

  it('warm-biome speedup is not in wiki (deprecated, always 1×)', () => {
    // Wiki has no warm-biome speedup; the legacy function stays
    // callable but no longer falsely doubles the rate.
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expect(hatchSpeedMultInWarmBiome(true)).toBe(1);
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expect(hatchSpeedMultInWarmBiome(false)).toBe(1);
  });

  it('GROW_TICKS = 48000 (wiki: 40 minutes, 2× normal baby)', () => {
    expect(GROW_TICKS).toBe(48000);
  });

  it('EGG_HATCH_TICKS = 24000 (wiki: 20 min default, non-moss)', () => {
    expect(EGG_HATCH_TICKS).toBe(24000);
  });
});
