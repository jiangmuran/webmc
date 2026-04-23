import { describe, it, expect } from 'vitest';
import { isPrimed, fuseTicksFor, dropsAsItemIfBroken, DEFAULT_FUSE_TICKS } from './tnt_fuse_ignite';

const base = {
  ignitedByRedstone: false,
  ignitedByFlint: false,
  ignitedByFire: false,
  hitByArrow: false,
};

describe('tnt fuse ignite', () => {
  it('unlit drops as item', () => {
    expect(dropsAsItemIfBroken(base)).toBe(true);
  });

  it('redstone primes', () => {
    expect(isPrimed({ ...base, ignitedByRedstone: true })).toBe(true);
  });

  it('arrow primes', () => {
    expect(isPrimed({ ...base, hitByArrow: true })).toBe(true);
  });

  it('fuse time default', () => {
    expect(fuseTicksFor({ ...base, ignitedByFlint: true })).toBe(DEFAULT_FUSE_TICKS);
  });
});
