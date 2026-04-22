import { describe, it, expect } from 'vitest';
import { tickLeash } from './leash';

describe('leash', () => {
  it('snaps past 10 blocks', () => {
    const r = tickLeash({ x: 0, y: 0, z: 0 }, { x: 11, y: 0, z: 0 });
    expect(r.snapped).toBe(true);
  });

  it('no pull when mob is close', () => {
    const r = tickLeash({ x: 0, y: 0, z: 0 }, { x: 3, y: 0, z: 0 });
    expect(r.snapped).toBe(false);
    expect(r.pullVec).toBeNull();
  });

  it('pulls when mob strays past 6 blocks', () => {
    const r = tickLeash({ x: 0, y: 0, z: 0 }, { x: 8, y: 0, z: 0 });
    expect(r.snapped).toBe(false);
    expect(r.pullVec).not.toBeNull();
    expect(r.pullVec?.x).toBeLessThan(0); // toward anchor
  });
});
