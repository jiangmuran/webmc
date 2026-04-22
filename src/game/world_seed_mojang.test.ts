import { describe, it, expect } from 'vitest';
import { parseSeed, javaStringHash, decorateSeed } from './world_seed_mojang';

describe('world seed parse', () => {
  it('digits pass through', () => {
    expect(parseSeed('42')).toBe(42n);
    expect(parseSeed('-7')).toBe(-7n);
  });

  it('string hash deterministic', () => {
    expect(javaStringHash('hello')).toBe(javaStringHash('hello'));
    expect(javaStringHash('a')).not.toBe(javaStringHash('b'));
  });

  it('empty string produces something', () => {
    expect(typeof parseSeed('')).toBe('bigint');
  });

  it('decorate wraps', () => {
    const d = decorateSeed('42');
    expect(d.worldSeed).toBe(42n);
    expect(d.displaySeed).toBe('42');
  });

  it('non-numeric hashed', () => {
    expect(parseSeed('minecraft')).toBe(javaStringHash('minecraft'));
  });
});
