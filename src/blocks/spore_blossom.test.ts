import { describe, it, expect } from 'vitest';
import { emitsParticleAt, canAttach, breaksIfAnchorLost } from './spore_blossom';

describe('spore blossom', () => {
  it('emits below within radius', () => {
    expect(emitsParticleAt({ x: 0, y: 10, z: 0 }, { x: 3, y: 5, z: 0 })).toBe(true);
  });

  it('does not emit above', () => {
    expect(emitsParticleAt({ x: 0, y: 10, z: 0 }, { x: 0, y: 12, z: 0 })).toBe(false);
  });

  it('clips beyond radius', () => {
    expect(emitsParticleAt({ x: 0, y: 10, z: 0 }, { x: 20, y: 5, z: 0 })).toBe(false);
  });

  it('requires solid above', () => {
    expect(canAttach(true)).toBe(true);
    expect(canAttach(false)).toBe(false);
  });

  it('breaks without anchor', () => {
    expect(breaksIfAnchorLost()).toBe(true);
  });
});
