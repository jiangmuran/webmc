import { describe, it, expect } from 'vitest';
import { nextDelayMs, shouldGiveUp, MAX_DELAY_MS } from './peer_reconnect_backoff';

describe('peer reconnect backoff', () => {
  it('doubles', () => {
    expect(nextDelayMs(2)).toBe(nextDelayMs(1) * 2);
  });

  it('caps at max', () => {
    expect(nextDelayMs(20)).toBe(MAX_DELAY_MS);
  });

  it('gives up at max attempts', () => {
    expect(shouldGiveUp(5, 5)).toBe(true);
    expect(shouldGiveUp(3, 5)).toBe(false);
  });
});
