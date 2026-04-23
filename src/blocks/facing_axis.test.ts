import { describe, it, expect } from 'vitest';
import { facingFromYaw, facingFromClickNormal, axisOf, oppositeOf } from './facing_axis';

describe('facing axis', () => {
  it('yaw 0 south', () => {
    expect(facingFromYaw(0)).toBe('south');
  });

  it('yaw 180 north', () => {
    expect(facingFromYaw(180)).toBe('north');
  });

  it('click normal up', () => {
    expect(facingFromClickNormal(0, 1, 0)).toBe('up');
  });

  it('click normal east', () => {
    expect(facingFromClickNormal(1, 0, 0)).toBe('east');
  });

  it('axis of up = y', () => {
    expect(axisOf('up')).toBe('y');
  });

  it('axis of east = x', () => {
    expect(axisOf('east')).toBe('x');
  });

  it('opposite symmetric', () => {
    const faces = ['north', 'south', 'east', 'west', 'up', 'down'] as const;
    for (const f of faces) expect(oppositeOf(oppositeOf(f))).toBe(f);
  });
});
