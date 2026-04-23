import { describe, it, expect } from 'vitest';
import { makeBucket, tryConsume, available } from './peer_rate_limit';

describe('peer rate limit', () => {
  it('starts full', () => {
    const b = makeBucket(10, 1, 0);
    expect(available(b, 0)).toBe(10);
  });

  it('consumes tokens', () => {
    const b = makeBucket(10, 1, 0);
    expect(tryConsume(b, 0, 3)).toBe(true);
    expect(available(b, 0)).toBe(7);
  });

  it('rejects when empty', () => {
    const b = makeBucket(2, 1, 0);
    tryConsume(b, 0, 2);
    expect(tryConsume(b, 0, 1)).toBe(false);
  });

  it('refills over time', () => {
    const b = makeBucket(10, 2, 0);
    tryConsume(b, 0, 10);
    expect(available(b, 1000)).toBeCloseTo(2);
  });

  it('refill capped at capacity', () => {
    const b = makeBucket(5, 10, 0);
    expect(available(b, 1e9)).toBe(5);
  });
});
