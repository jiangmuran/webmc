import { describe, it, expect } from 'vitest';
import { formatSeed, makeRng, parseSeed, stringToSeed } from './world_seed';

describe('world seed', () => {
  it('numeric input round-trips', () => {
    const r = parseSeed({ input: '12345', randomFallback: () => 0n });
    expect(r.asBigInt).toBe(12345n);
    expect(r.generatedRandomly).toBe(false);
  });

  it('empty input = random', () => {
    const r = parseSeed({ input: '', randomFallback: () => 42n });
    expect(r.asBigInt).toBe(42n);
    expect(r.generatedRandomly).toBe(true);
  });

  it('string hash is deterministic', () => {
    const a = stringToSeed('hello');
    const b = stringToSeed('hello');
    expect(a).toBe(b);
  });

  it('different strings = different seeds', () => {
    expect(stringToSeed('a')).not.toBe(stringToSeed('b'));
  });

  it('formatSeed ↔ parseSeed round-trip', () => {
    const orig = -1234567890123456n;
    const str = formatSeed(orig);
    const back = parseSeed({ input: str, randomFallback: () => 0n });
    expect(back.asBigInt).toBe(orig);
  });

  it('rng is deterministic for same seed', () => {
    const a = makeRng(42n);
    const b = makeRng(42n);
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  it('rng returns 0..1', () => {
    const r = makeRng(42n);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
