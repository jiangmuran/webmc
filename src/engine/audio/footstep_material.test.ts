import { describe, it, expect } from 'vitest';
import { family, volume, pitchVariance } from './footstep_material';

describe('footstep material', () => {
  it('grass block → grass', () => {
    expect(family('grass_block')).toBe('grass');
  });

  it('stone → stone', () => {
    expect(family('stone')).toBe('stone');
  });

  it('unknown → grass default', () => {
    expect(family('unknown_block')).toBe('grass');
  });

  it('wool quieter', () => {
    expect(volume('wool')).toBeLessThan(volume('stone'));
  });

  it('slime soft', () => {
    expect(volume('slime')).toBeLessThan(volume('wool'));
  });

  it('pitch variance > 0', () => {
    expect(pitchVariance()).toBeGreaterThan(0);
  });
});
