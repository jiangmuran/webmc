// Per-peer rate limiter. Separate buckets for each message kind to
// protect against edit-storm or chat flood.

export interface RateBucket {
  tokens: number;
  capacity: number;
  refillPerSec: number;
  lastRefillMs: number;
}

export function makeBucket(capacity: number, refillPerSec: number, nowMs: number): RateBucket {
  return { tokens: capacity, capacity, refillPerSec, lastRefillMs: nowMs };
}

function refill(b: RateBucket, nowMs: number): void {
  const dt = Math.max(0, nowMs - b.lastRefillMs) / 1000;
  b.tokens = Math.min(b.capacity, b.tokens + dt * b.refillPerSec);
  b.lastRefillMs = nowMs;
}

export function tryConsume(b: RateBucket, nowMs: number, cost = 1): boolean {
  refill(b, nowMs);
  if (b.tokens < cost) return false;
  b.tokens -= cost;
  return true;
}

export function available(b: RateBucket, nowMs: number): number {
  refill(b, nowMs);
  return b.tokens;
}
