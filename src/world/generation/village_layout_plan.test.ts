import { describe, it, expect } from 'vitest';
import { pickBuilding, villageBuildingCount, hasIronGolemSpawner } from './village_layout_plan';

describe('village layout plan', () => {
  it('plains building prefixed', () => {
    expect(pickBuilding('plains', () => 0)).toContain('plains_');
  });

  it('desert variant', () => {
    expect(pickBuilding('desert', () => 0)).toContain('desert_');
  });

  it('count in range', () => {
    const n = villageBuildingCount(() => 0.5);
    expect(n).toBeGreaterThanOrEqual(4);
    expect(n).toBeLessThanOrEqual(12);
  });

  it('large village has golem spawner', () => {
    expect(hasIronGolemSpawner(10)).toBe(true);
  });

  it('small village no golem spawner', () => {
    expect(hasIronGolemSpawner(3)).toBe(false);
  });

  it('last building fallback', () => {
    expect(pickBuilding('plains', () => 0.9999)).toContain('plains_');
  });
});
