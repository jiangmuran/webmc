import { describe, it, expect } from 'vitest';
import { regionSize, SPACING } from './structure_spawn_density';

describe('structure spawn density', () => {
  it('woodland mansion far apart', () => {
    expect(regionSize('woodland_mansion')).toBeGreaterThan(regionSize('village'));
  });

  it('mineshaft spammed', () => {
    expect(regionSize('mineshaft')).toBe(1);
  });

  it('all positive', () => {
    for (const v of Object.values(SPACING)) {
      expect(v).toBeGreaterThan(0);
    }
  });
});
