import { describe, it, expect } from 'vitest';
import { hashStringToSeed, deriveSubSeed, rngFromSeed } from './worldgen_seed_derive';

describe('worldgen seed derive', () => {
  it('same string same seed', () => {
    expect(hashStringToSeed('webmc')).toBe(hashStringToSeed('webmc'));
  });

  it('different string different seed', () => {
    expect(hashStringToSeed('webmc')).not.toBe(hashStringToSeed('something'));
  });

  it('derive combines', () => {
    expect(deriveSubSeed(12345, 'caves')).not.toBe(deriveSubSeed(12345, 'ores'));
  });

  it('rng is deterministic', () => {
    const a = rngFromSeed(42);
    const b = rngFromSeed(42);
    expect(a()).toBe(b());
  });

  it('rng in [0,1)', () => {
    const r = rngFromSeed(7);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
