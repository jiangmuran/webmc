import { describe, it, expect } from 'vitest';
import { hingeFor, openPair, closePair, type Door } from './door_double_open';

describe('double door', () => {
  it('default hinge left', () => {
    expect(hingeFor({ facing: 'north', neighborLeft: null, neighborRight: null })).toBe('left');
  });

  it('mirrors neighbor left-hinge', () => {
    expect(
      hingeFor({
        facing: 'north',
        neighborLeft: { facing: 'north', hinge: 'left', open: false },
        neighborRight: null,
      }),
    ).toBe('right');
  });

  it('opens pair', () => {
    const a: Door = { id: 'a', state: { facing: 'north', hinge: 'left', open: false } };
    const b: Door = { id: 'b', state: { facing: 'north', hinge: 'right', open: false } };
    const updated = openPair(a, b);
    expect(updated.sort()).toEqual(['a', 'b']);
    expect(a.state.open).toBe(true);
    expect(b.state.open).toBe(true);
  });

  it('does not open mismatched facing', () => {
    const a: Door = { id: 'a', state: { facing: 'north', hinge: 'left', open: false } };
    const b: Door = { id: 'b', state: { facing: 'east', hinge: 'right', open: false } };
    openPair(a, b);
    expect(b.state.open).toBe(false);
  });

  it('close pair', () => {
    const a: Door = { id: 'a', state: { facing: 'north', hinge: 'left', open: true } };
    const b: Door = { id: 'b', state: { facing: 'north', hinge: 'right', open: true } };
    closePair(a, b);
    expect(a.state.open).toBe(false);
    expect(b.state.open).toBe(false);
  });
});
