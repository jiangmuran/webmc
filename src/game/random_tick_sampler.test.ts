import { describe, it, expect } from 'vitest';
import {
  samplesForTick,
  expectedTicksPerBlockPerGameTick,
  SECTION_VOLUME,
  DEFAULT_RANDOM_TICK_SPEED,
} from './random_tick_sampler';

describe('random tick sampler', () => {
  it('3 per section default', () => {
    const s = samplesForTick({
      sectionCount: 4,
      randomTickSpeed: DEFAULT_RANDOM_TICK_SPEED,
      rng: () => 0.5,
    });
    expect(s).toHaveLength(4 * DEFAULT_RANDOM_TICK_SPEED);
  });

  it('zero speed → no samples', () => {
    expect(samplesForTick({ sectionCount: 4, randomTickSpeed: 0, rng: () => 0.5 })).toEqual([]);
  });

  it('local index in range', () => {
    const s = samplesForTick({ sectionCount: 1, randomTickSpeed: 100, rng: () => 0.99 });
    expect(s.every((x) => x.localIndex < SECTION_VOLUME)).toBe(true);
  });

  it('expected rate scales with speed', () => {
    expect(expectedTicksPerBlockPerGameTick({ randomTickSpeed: 6 })).toBeGreaterThan(
      expectedTicksPerBlockPerGameTick({ randomTickSpeed: 3 }),
    );
  });

  it('section assignment correct', () => {
    const s = samplesForTick({ sectionCount: 3, randomTickSpeed: 1, rng: () => 0 });
    expect(new Set(s.map((x) => x.section))).toEqual(new Set([0, 1, 2]));
  });
});
