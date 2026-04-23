import { describe, it, expect } from 'vitest';
import {
  yInRange,
  spawnRatioPerChunk,
  containsBuddingAmethyst,
  DEFAULT_PARAMS,
} from './amethyst_geode_seed';

describe('amethyst geode seed', () => {
  it('Y in deepslate range', () => {
    expect(yInRange(0)).toBe(true);
    expect(yInRange(100)).toBe(false);
  });

  it('rare spawn', () => {
    expect(spawnRatioPerChunk()).toBeLessThan(0.05);
  });

  it('budding inside', () => {
    expect(containsBuddingAmethyst()).toBe(true);
  });

  it('has calcite shell', () => {
    expect(DEFAULT_PARAMS.outerBlock).toBe('calcite');
  });
});
