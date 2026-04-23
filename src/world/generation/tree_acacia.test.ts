import { describe, it, expect } from 'vitest';
import { rollAcacia, canopyIsFlat, biomeAcacia } from './tree_acacia';

describe('acacia tree', () => {
  it('has trunk and canopy', () => {
    const a = rollAcacia(() => 0.5);
    expect(a.trunkHeight).toBeGreaterThan(0);
    expect(a.canopyRadius).toBeGreaterThan(0);
  });

  it('canopy flat', () => {
    expect(canopyIsFlat()).toBe(true);
  });

  it('biome check', () => {
    expect(biomeAcacia('savanna')).toBe(true);
    expect(biomeAcacia('plains')).toBe(false);
  });
});
