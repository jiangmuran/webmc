import { describe, it, expect } from 'vitest';
import { materialOfLayer, planIceberg } from './iceberg';

describe('iceberg', () => {
  it('3..11 segments', () => {
    const i = planIceberg({
      origin: { x: 0, y: 60, z: 0 },
      rng: () => 0.5,
      maxHeight: 100,
    });
    expect(i.segments.length).toBeGreaterThanOrEqual(3);
    expect(i.segments.length).toBeLessThanOrEqual(11);
  });

  it('bottom is blue ice', () => {
    const i = planIceberg({
      origin: { x: 0, y: 60, z: 0 },
      rng: () => 0.1,
      maxHeight: 100,
    });
    expect(i.segments[0]?.material).toBe('blue_ice');
  });

  it('height capped by maxHeight', () => {
    const i = planIceberg({
      origin: { x: 0, y: 60, z: 0 },
      rng: () => 0.5,
      maxHeight: 10,
    });
    expect(i.height).toBeLessThanOrEqual(15);
  });

  it('materialOfLayer returns correct ids', () => {
    expect(materialOfLayer(0, 5)).toBe('webmc:blue_ice');
    expect(materialOfLayer(4, 5)).toBe('webmc:snow_block');
    expect(materialOfLayer(2, 5)).toBe('webmc:packed_ice');
  });
});
