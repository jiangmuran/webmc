import { describe, it, expect } from 'vitest';
import { AckWindow } from './packet_ack';

describe('ack window', () => {
  it('ack removes pending', () => {
    const w = new AckWindow();
    const p = w.send(new Uint8Array([1, 2, 3]), 0);
    expect(w.pendingCount).toBe(1);
    expect(w.ack(p.seq, 10)).toBe(true);
    expect(w.pendingCount).toBe(0);
  });

  it('unknown ack ignored', () => {
    const w = new AckWindow();
    expect(w.ack(999, 0)).toBe(false);
  });

  it('timeouts after window', () => {
    const w = new AckWindow();
    w.send(new Uint8Array([1]), 0);
    expect(w.timeoutsFor(100).length).toBe(0);
    expect(w.timeoutsFor(10_000).length).toBe(1);
  });

  it('rtt smoothing', () => {
    const w = new AckWindow();
    const initial = w.smoothedRttMs;
    const p = w.send(new Uint8Array([1]), 0);
    w.ack(p.seq, 300);
    expect(w.smoothedRttMs).not.toBe(initial);
  });

  it('markResent resets timer', () => {
    const w = new AckWindow();
    const p = w.send(new Uint8Array([1]), 0);
    w.markResent(p.seq, 500);
    expect(w.timeoutsFor(500).length).toBe(0);
  });
});
