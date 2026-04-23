import { describe, it, expect } from 'vitest';
import { computeShape } from './wall_connect';

describe('wall connect', () => {
  it('N-S straight is short post', () => {
    const s = computeShape({
      north: true,
      south: true,
      east: false,
      west: false,
      above: false,
    });
    expect(s.tall).toBe(false);
    expect(s.connections.north).toBe('low');
    expect(s.connections.east).toBe('none');
  });

  it('block above forces tall post', () => {
    const s = computeShape({
      north: true,
      south: true,
      east: false,
      west: false,
      above: true,
    });
    expect(s.tall).toBe(true);
    expect(s.connections.north).toBe('tall');
  });

  it('T-junction tall post', () => {
    const s = computeShape({
      north: true,
      south: false,
      east: true,
      west: true,
      above: false,
    });
    expect(s.tall).toBe(true);
  });
});
