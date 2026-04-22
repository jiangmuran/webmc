// Per-peer packet throttle. Caps the outbound bytes-per-second to a
// peer; if the budget is exceeded, packets queue or get dropped. Works
// alongside the RateLimiter (which counts messages); this throttle
// counts bytes.

export interface ThrottleConfig {
  bytesPerSec: number;
  burstCapacityBytes: number;
}

export interface BytesBucket {
  bytesAvailable: number;
  lastRefillSec: number;
  readonly capacity: number;
  readonly refillPerSec: number;
}

export function makeBytesBucket(config: ThrottleConfig, initialTime = 0): BytesBucket {
  return {
    bytesAvailable: config.burstCapacityBytes,
    lastRefillSec: initialTime,
    capacity: config.burstCapacityBytes,
    refillPerSec: config.bytesPerSec,
  };
}

export function refill(bucket: BytesBucket, nowSec: number): void {
  const elapsed = Math.max(0, nowSec - bucket.lastRefillSec);
  bucket.lastRefillSec = nowSec;
  bucket.bytesAvailable = Math.min(
    bucket.capacity,
    bucket.bytesAvailable + elapsed * bucket.refillPerSec,
  );
}

export function tryConsume(bucket: BytesBucket, bytes: number, nowSec: number): boolean {
  refill(bucket, nowSec);
  if (bucket.bytesAvailable < bytes) return false;
  bucket.bytesAvailable -= bytes;
  return true;
}

// Per-peer throttle manager: one bucket per peer + background pruning.
export class PacketThrottle {
  private readonly buckets = new Map<string, BytesBucket>();
  private readonly config: ThrottleConfig;

  constructor(config: ThrottleConfig) {
    this.config = config;
  }

  allowSend(peerId: string, bytes: number, nowSec: number): boolean {
    let bucket = this.buckets.get(peerId);
    if (!bucket) {
      bucket = makeBytesBucket(this.config, nowSec);
      this.buckets.set(peerId, bucket);
    }
    return tryConsume(bucket, bytes, nowSec);
  }

  availableFor(peerId: string, nowSec: number): number {
    const bucket = this.buckets.get(peerId);
    if (!bucket) return this.config.burstCapacityBytes;
    refill(bucket, nowSec);
    return bucket.bytesAvailable;
  }

  forget(peerId: string): void {
    this.buckets.delete(peerId);
  }
}

// Default config: 64 KB/s, 128 KB burst.
export const DEFAULT_THROTTLE: ThrottleConfig = {
  bytesPerSec: 64 * 1024,
  burstCapacityBytes: 128 * 1024,
};
