import { describe, it, expect } from 'vitest';
import { RateLimiter, TokenBucket } from './rate_limit';

describe('token bucket', () => {
  it('starts full', () => {
    const b = new TokenBucket({ capacity: 5, refillPerSec: 1 }, 0);
    expect(b.available).toBe(5);
  });

  it('consumes down to zero', () => {
    const b = new TokenBucket({ capacity: 5, refillPerSec: 0 }, 0);
    for (let i = 0; i < 5; i++) expect(b.tryConsume(1, 0)).toBe(true);
    expect(b.tryConsume(1, 0)).toBe(false);
  });

  it('refills at rate', () => {
    const b = new TokenBucket({ capacity: 5, refillPerSec: 1 }, 0);
    b.tryConsume(5, 0);
    b.tryConsume(0, 2); // refresh
    expect(b.available).toBe(2);
  });

  it('refill clamps at capacity', () => {
    const b = new TokenBucket({ capacity: 5, refillPerSec: 100 }, 0);
    b.tryConsume(3, 0);
    b.tryConsume(0, 100);
    expect(b.available).toBe(5);
  });
});

describe('rate limiter', () => {
  const l = new RateLimiter({
    defaults: { capacity: 3, refillPerSec: 0 },
    perType: { chat: { capacity: 1, refillPerSec: 0 } },
  });

  it('per-type config overrides default', () => {
    expect(l.allow('p1', 'chat', 0)).toBe(true);
    expect(l.allow('p1', 'chat', 0)).toBe(false);
  });

  it('default bucket allows 3 before blocking', () => {
    for (let i = 0; i < 3; i++) expect(l.allow('p2', 'move', 0)).toBe(true);
    expect(l.allow('p2', 'move', 0)).toBe(false);
  });

  it('different peers have separate buckets', () => {
    expect(l.allow('p3', 'chat', 0)).toBe(true);
    expect(l.allow('p4', 'chat', 0)).toBe(true);
  });

  it('forgetPeer clears buckets', () => {
    l.allow('p5', 'chat', 0);
    l.forgetPeer('p5');
    expect(l.tokensFor('p5', 'chat')).toBeNull();
  });
});
