import { describe, it, expect } from 'vitest';
import { stringToSeed, levelsToLong } from './world_seed_hash';

describe('world seed hash', () => {
  it('numeric string → int', () => {
    expect(stringToSeed('123')).toBe(123);
  });

  it('deterministic for same string', () => {
    expect(stringToSeed('Glacier')).toBe(stringToSeed('Glacier'));
  });

  it('empty → random-ish (non-zero)', () => {
    expect(stringToSeed('')).not.toBe(0);
  });

  it('different strings diff seeds', () => {
    expect(stringToSeed('foo')).not.toBe(stringToSeed('bar'));
  });

  it('long split', () => {
    const { hi, lo } = levelsToLong(0x12345678);
    expect(lo).toBe(0x12345678);
    expect(hi).toBe(0);
  });
});
