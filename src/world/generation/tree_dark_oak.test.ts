import { describe, it, expect } from 'vitest';
import { rollDarkOak, trunkBlockCount, requiresDarkForestBiome } from './tree_dark_oak';

describe('dark oak tree', () => {
  it('2x2 trunk', () => {
    const t = rollDarkOak(() => 0.5);
    expect(t.trunkSize).toBe(2);
  });

  it('height in range', () => {
    const t = rollDarkOak(() => 0.5);
    expect(t.trunkHeight).toBeGreaterThanOrEqual(6);
    expect(t.trunkHeight).toBeLessThanOrEqual(9);
  });

  it('trunk count 4 * height', () => {
    const t = rollDarkOak(() => 0.5);
    expect(trunkBlockCount(t)).toBe(t.trunkHeight * 4);
  });

  it('biome check', () => {
    expect(requiresDarkForestBiome('dark_forest')).toBe(true);
    expect(requiresDarkForestBiome('plains')).toBe(false);
  });
});
