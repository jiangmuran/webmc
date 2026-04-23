import { describe, it, expect } from 'vitest';
import { integrate, hasLanded } from './falling_block_gravity';

describe('falling block gravity', () => {
  it('gains speed downward', () => {
    const a = integrate({ vy: 0, y: 10 });
    const b = integrate(a);
    expect(b.vy).toBeLessThan(a.vy);
  });

  it('y decreases', () => {
    const a = integrate({ vy: 0, y: 10 });
    expect(a.y).toBeLessThan(10);
  });

  it('lands at ground', () => {
    expect(hasLanded({ vy: -1, y: 0 }, 0)).toBe(true);
    expect(hasLanded({ vy: -1, y: 10 }, 0)).toBe(false);
  });
});
