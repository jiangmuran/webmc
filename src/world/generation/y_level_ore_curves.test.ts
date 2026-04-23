import { describe, it, expect } from 'vitest';
import { densityAtY, bestOreAt } from './y_level_ore_curves';

describe('y level ore curves', () => {
  it('coal density at surface', () => {
    expect(densityAtY('coal', 96)).toBeGreaterThan(0);
  });

  it('diamond deep', () => {
    expect(densityAtY('diamond', -60)).toBeGreaterThan(0);
  });

  it('diamond not at surface', () => {
    expect(densityAtY('diamond', 100)).toBe(0);
  });

  it('emerald only in mountains', () => {
    expect(densityAtY('emerald', 200)).toBeGreaterThan(0);
    expect(densityAtY('emerald', 64)).toBeGreaterThanOrEqual(0);
  });

  it('bestOreAt deep', () => {
    expect(bestOreAt(-60)).toBeDefined();
  });

  it('bestOreAt high air', () => {
    expect(bestOreAt(350)).toBeUndefined();
  });

  it('gold peaks in deepslate', () => {
    const deep = densityAtY('gold', -16);
    const shallow = densityAtY('gold', 30);
    expect(deep).toBeGreaterThan(shallow);
  });
});
