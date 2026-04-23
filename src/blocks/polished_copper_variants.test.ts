import { describe, it, expect } from 'vitest';
import { nextStage, waxedPrefix, scrubsOnAxeHit } from './polished_copper_variants';

describe('polished copper variants', () => {
  it('copper → exposed', () => {
    expect(nextStage('copper_block')).toBe('exposed_copper');
  });

  it('oxidized ends progression', () => {
    expect(nextStage('oxidized_copper')).toBeUndefined();
  });

  it('waxed name', () => {
    expect(waxedPrefix('weathered_copper')).toBe('waxed_weathered_copper');
  });

  it('axe scrubs back', () => {
    expect(scrubsOnAxeHit('weathered_copper')).toBe('exposed_copper');
  });

  it('fresh copper no scrub', () => {
    expect(scrubsOnAxeHit('copper_block')).toBeUndefined();
  });
});
