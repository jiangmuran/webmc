import { describe, it, expect } from 'vitest';
import { makePingState, onPong, p95RttMs, prunePending, sendPing, smoothedRttMs } from './ping_rtt';

describe('ping rtt', () => {
  it('round-trips a ping', () => {
    const s = makePingState();
    const nonce = sendPing(s, 0);
    const r = onPong(s, nonce, 0.1);
    expect(r.rttMs).toBeCloseTo(100);
    expect(r.wasUnknown).toBe(false);
  });

  it('unknown pong flagged', () => {
    const s = makePingState();
    expect(onPong(s, 42, 1).wasUnknown).toBe(true);
  });

  it('smoothed rtt is the mean of samples', () => {
    const s = makePingState();
    const n1 = sendPing(s, 0);
    onPong(s, n1, 0.1);
    const n2 = sendPing(s, 0);
    onPong(s, n2, 0.2);
    expect(smoothedRttMs(s)).toBeCloseTo(150);
  });

  it('p95 rtt captures tail', () => {
    const s = makePingState();
    for (let i = 0; i < 100; i++) {
      const n = sendPing(s, 0);
      const rtt = (i < 95 ? 10 : 500) / 1000;
      onPong(s, n, rtt);
    }
    expect(p95RttMs(s)).toBeGreaterThan(400);
  });

  it('prunePending drops stale', () => {
    const s = makePingState();
    sendPing(s, 0);
    sendPing(s, 0);
    const n = prunePending(s, 10, 5);
    expect(n).toBe(2);
  });
});
