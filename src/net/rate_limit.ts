// Per-message-type token-bucket rate limiter. Used on the host side to
// drop misbehaving clients' message floods without stalling well-behaved
// peers. Configurable per message type; default conservative bucket.

export interface BucketConfig {
  capacity: number;
  refillPerSec: number;
}

export class TokenBucket {
  private tokens: number;
  private readonly capacity: number;
  private readonly refillPerSec: number;
  private lastRefillSec: number;

  constructor(config: BucketConfig, initialTime = 0) {
    this.capacity = config.capacity;
    this.refillPerSec = config.refillPerSec;
    this.tokens = config.capacity;
    this.lastRefillSec = initialTime;
  }

  tryConsume(amount: number, nowSec: number): boolean {
    this.refill(nowSec);
    if (this.tokens < amount) return false;
    this.tokens -= amount;
    return true;
  }

  get available(): number {
    return this.tokens;
  }

  private refill(nowSec: number): void {
    const elapsed = Math.max(0, nowSec - this.lastRefillSec);
    this.lastRefillSec = nowSec;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillPerSec);
  }
}

export interface RateLimitOptions {
  defaults: BucketConfig;
  perType?: Record<string, BucketConfig>;
}

export class RateLimiter {
  private readonly perPeer = new Map<string, Map<string, TokenBucket>>();
  private readonly defaults: BucketConfig;
  private readonly perType: Record<string, BucketConfig>;

  constructor(opts: RateLimitOptions) {
    this.defaults = opts.defaults;
    this.perType = opts.perType ?? {};
  }

  allow(peerId: string, msgType: string, nowSec: number): boolean {
    let forPeer = this.perPeer.get(peerId);
    if (!forPeer) {
      forPeer = new Map();
      this.perPeer.set(peerId, forPeer);
    }
    let bucket = forPeer.get(msgType);
    if (!bucket) {
      const cfg = this.perType[msgType] ?? this.defaults;
      bucket = new TokenBucket(cfg, nowSec);
      forPeer.set(msgType, bucket);
    }
    return bucket.tryConsume(1, nowSec);
  }

  forgetPeer(peerId: string): void {
    this.perPeer.delete(peerId);
  }

  // For tests: expose bucket state.
  tokensFor(peerId: string, msgType: string): number | null {
    return this.perPeer.get(peerId)?.get(msgType)?.available ?? null;
  }
}
