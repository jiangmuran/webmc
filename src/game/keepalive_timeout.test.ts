import { describe, it, expect } from 'vitest';
import {
  shouldSendPing,
  isTimedOut,
  onAck,
  latencyBucket,
  KEEPALIVE_INTERVAL_MS,
  KEEPALIVE_TIMEOUT_MS,
} from './keepalive_timeout';

describe('keepalive timeout', () => {
  const s = { lastSentMs: 0, lastAckedMs: 0, latencyMs: 0 };

  it('sends after interval', () => {
    expect(shouldSendPing(s, KEEPALIVE_INTERVAL_MS)).toBe(true);
    expect(shouldSendPing(s, 1000)).toBe(false);
  });

  it('times out after threshold', () => {
    expect(isTimedOut(s, KEEPALIVE_TIMEOUT_MS)).toBe(true);
    expect(isTimedOut(s, 1000)).toBe(false);
  });

  it('ack updates latency', () => {
    const r = onAck(s, 1050, 1000);
    expect(r.latencyMs).toBe(50);
    expect(r.lastAckedMs).toBe(1050);
  });

  it('latency buckets', () => {
    expect(latencyBucket(30)).toBe('excellent');
    expect(latencyBucket(100)).toBe('good');
    expect(latencyBucket(200)).toBe('poor');
    expect(latencyBucket(500)).toBe('bad');
  });
});
