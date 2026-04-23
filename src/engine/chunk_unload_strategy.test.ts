import { describe, it, expect } from 'vitest';
import { pickEvictionCandidates, score } from './chunk_unload_strategy';

describe('chunk unload strategy', () => {
  it('far chunks have higher score', () => {
    const near = { key: 'a', dx: 1, dz: 1, lastAccessedTick: 100, dirty: false };
    const far = { key: 'b', dx: 10, dz: 10, lastAccessedTick: 100, dirty: false };
    expect(score(far, 100)).toBeGreaterThan(score(near, 100));
  });

  it('dirty chunks protected', () => {
    const dirty = { key: 'a', dx: 100, dz: 100, lastAccessedTick: 0, dirty: true };
    const clean = { key: 'b', dx: 1, dz: 1, lastAccessedTick: 0, dirty: false };
    expect(score(dirty, 1000)).toBeLessThan(score(clean, 1000));
  });

  it('picks highest score first', () => {
    const chunks = [
      { key: 'near', dx: 1, dz: 1, lastAccessedTick: 1000, dirty: false },
      { key: 'far', dx: 10, dz: 10, lastAccessedTick: 0, dirty: false },
    ];
    const picked = pickEvictionCandidates(chunks, 1000, 1);
    expect(picked[0]?.key).toBe('far');
  });
});
