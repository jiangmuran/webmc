import { describe, it, expect } from 'vitest';
import { accumulateStep, shovel, heightBlocks, entitySinks, MAX_LAYERS } from './snow_accumulate';

describe('snow accumulate', () => {
  it('no snowing no change', () => {
    expect(accumulateStep({ layers: 1 }, false, () => 0).layers).toBe(1);
  });

  it('caps at 8', () => {
    expect(accumulateStep({ layers: 8 }, true, () => 0).layers).toBe(MAX_LAYERS);
  });

  it('shovel removes layer', () => {
    expect(shovel({ layers: 3 })?.layers).toBe(2);
  });

  it('shovel last removes block', () => {
    expect(shovel({ layers: 1 })).toBeNull();
  });

  it('height = layers/8', () => {
    expect(heightBlocks({ layers: 8 })).toBe(1);
    expect(heightBlocks({ layers: 4 })).toBe(0.5);
  });

  it('sink at ≥2', () => {
    expect(entitySinks({ layers: 1 })).toBe(false);
    expect(entitySinks({ layers: 2 })).toBe(true);
  });
});
