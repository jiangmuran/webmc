import { describe, it, expect } from 'vitest';
import { clamp } from './input_bounded_delta';

describe('input bounded delta', () => {
  it('clamps horizontal', () => {
    const r = clamp({ dx: 100, dy: 0, dz: 0, dtMs: 1000 });
    expect(r.dx).toBeLessThan(100);
  });

  it('zero dt blocks', () => {
    expect(clamp({ dx: 50, dy: 50, dz: 50, dtMs: 0 })).toMatchObject({ dx: 0, dy: 0, dz: 0 });
  });

  it('fast drop clamped', () => {
    const r = clamp({ dx: 0, dy: -200, dz: 0, dtMs: 1000 });
    expect(r.dy).toBeGreaterThan(-200);
  });
});
