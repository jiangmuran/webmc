import { describe, it, expect } from 'vitest';
import { computeShape } from './stairs_shape_compute';

describe('stairs shape compute', () => {
  it('isolated straight', () => {
    expect(computeShape('north', undefined, undefined)).toBe('straight');
  });

  it('matching neighbor straight', () => {
    expect(computeShape('north', 'north', undefined)).toBe('straight');
  });

  it('perpendicular behind inner', () => {
    const s = computeShape('north', 'east', undefined);
    expect(s).toMatch(/^inner_/);
  });

  it('perpendicular front outer', () => {
    const s = computeShape('north', undefined, 'east');
    expect(s).toMatch(/^outer_/);
  });

  it('opposite neighbor straight', () => {
    expect(computeShape('north', 'south', undefined)).toBe('straight');
  });
});
