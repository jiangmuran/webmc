import { describe, it, expect } from 'vitest';
import { computeShape } from './stair_shape_compute';

describe('stair shape', () => {
  it('no neighbors = straight', () => {
    expect(computeShape({ facing: 'n' })).toBe('straight');
  });

  it('perpendicular back = inner', () => {
    const s = computeShape({ facing: 'n', neighborBack: 'e' });
    expect(s === 'inner_left' || s === 'inner_right').toBe(true);
  });

  it('outer left', () => {
    expect(computeShape({ facing: 'n', neighborLeft: 'e' })).toBe('outer_left');
  });

  it('outer right', () => {
    expect(computeShape({ facing: 'n', neighborRight: 'e' })).toBe('outer_right');
  });
});
