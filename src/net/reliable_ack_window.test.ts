import { describe, it, expect } from 'vitest';
import { makeSender, send, ack, dueForRetransmit, retransmit } from './reliable_ack_window';

describe('reliable ack window', () => {
  it('send tracks unacked', () => {
    const s = makeSender();
    send(s, 'hello', 0);
    expect(s.unacked.size).toBe(1);
  });

  it('ack removes', () => {
    const s = makeSender();
    const p = send(s, 'x', 0);
    expect(ack(s, p.seq)).toBe(true);
    expect(s.unacked.size).toBe(0);
  });

  it('due after rto', () => {
    const s = makeSender(100);
    send(s, 'x', 0);
    expect(dueForRetransmit(s, 50).length).toBe(0);
    expect(dueForRetransmit(s, 200).length).toBe(1);
  });

  it('retransmit resets timer', () => {
    const s = makeSender(100, 5);
    const p = send(s, 'x', 0);
    const r = retransmit(s, p.seq, 500);
    expect(r?.attempts).toBe(2);
    expect(r?.sentAtMs).toBe(500);
  });

  it('give up after max attempts', () => {
    const s = makeSender(100, 2);
    const p = send(s, 'x', 0);
    retransmit(s, p.seq, 500);
    expect(retransmit(s, p.seq, 1000)).toBeNull();
    expect(s.unacked.has(p.seq)).toBe(false);
  });
});
