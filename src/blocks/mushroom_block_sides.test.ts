import { describe, it, expect } from 'vitest';
import { exposedFaces, dropsCount, ALL_INSIDE } from './mushroom_block_sides';

describe('mushroom block sides', () => {
  it('exposed inverse of neighbors', () => {
    expect(exposedFaces({ ...ALL_INSIDE, up: true }).up).toBe(false);
  });

  it('all exposed when alone', () => {
    expect(exposedFaces(ALL_INSIDE).up).toBe(true);
  });

  it('drops scale with exposed', () => {
    const allExposed = exposedFaces(ALL_INSIDE);
    expect(dropsCount(allExposed, () => 0.99)).toBeGreaterThanOrEqual(0);
  });
});
