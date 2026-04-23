import { describe, it, expect } from 'vitest';
import { tryConsume } from './bandwidth_budget';

describe('bandwidth budget', () => {
  it('under limit allows', () => {
    const r = tryConsume(
      { bytesThisSecond: 0, bytesPerSecondLimit: 1000, secondStartMs: 0 },
      0,
      500,
    );
    expect(r.allowed).toBe(true);
    expect(r.state.bytesThisSecond).toBe(500);
  });

  it('over limit denies', () => {
    const r = tryConsume(
      { bytesThisSecond: 900, bytesPerSecondLimit: 1000, secondStartMs: 0 },
      0,
      200,
    );
    expect(r.allowed).toBe(false);
  });

  it('window reset after 1s', () => {
    const r = tryConsume(
      { bytesThisSecond: 999, bytesPerSecondLimit: 1000, secondStartMs: 0 },
      1500,
      500,
    );
    expect(r.allowed).toBe(true);
  });
});
