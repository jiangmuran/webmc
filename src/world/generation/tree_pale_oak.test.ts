import { describe, it, expect } from 'vitest';
import { rollPaleOak, biome, dropsResinClumpChance } from './tree_pale_oak';

describe('pale oak tree', () => {
  it('height in range', () => {
    const p = rollPaleOak(() => 0.5);
    expect(p.trunkHeight).toBeGreaterThanOrEqual(7);
    expect(p.trunkHeight).toBeLessThanOrEqual(10);
  });

  it('creaking heart sometimes', () => {
    expect(rollPaleOak(() => 0).creakingHeartSpawns).toBe(true);
  });

  it('pale garden biome', () => {
    expect(biome()).toBe('pale_garden');
  });

  it('resin chance positive', () => {
    expect(dropsResinClumpChance()).toBeGreaterThan(0);
  });
});
