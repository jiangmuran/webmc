import { describe, it, expect } from 'vitest';
import {
  isTimedOut,
  shouldSendPing,
  recordPong,
  averageRtt,
  TIMEOUT_MS,
  PING_INTERVAL_MS,
  type PeerHealth,
} from './peer_ping_timeout';

const p: PeerHealth = {
  peerId: 'a',
  lastPingSentMs: 0,
  lastPongReceivedMs: 0,
  rttMsSamples: [],
};

describe('peer ping timeout', () => {
  it('recent pong not timed out', () => {
    expect(isTimedOut(p, 100)).toBe(false);
  });

  it('old pong timed out', () => {
    expect(isTimedOut(p, TIMEOUT_MS + 1)).toBe(true);
  });

  it('send ping when interval lapses', () => {
    expect(shouldSendPing(p, PING_INTERVAL_MS)).toBe(true);
  });

  it('no ping if recent', () => {
    expect(shouldSendPing(p, 100)).toBe(false);
  });

  it('record pong computes rtt', () => {
    const after = recordPong({ ...p, lastPingSentMs: 100 }, 150);
    expect(after.rttMsSamples).toContain(50);
  });

  it('average empty is 0', () => {
    expect(averageRtt(p)).toBe(0);
  });

  it('average of samples', () => {
    expect(averageRtt({ ...p, rttMsSamples: [10, 20, 30] })).toBe(20);
  });
});
