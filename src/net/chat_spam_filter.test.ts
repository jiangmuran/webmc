import { describe, it, expect } from 'vitest';
import { classify, record, MAX_MSGS_PER_WINDOW, type SpamState } from './chat_spam_filter';

function mkState(): SpamState {
  return { recentByPeer: new Map() };
}

describe('chat spam filter', () => {
  it('first ok', () => {
    expect(classify({ peerId: 'p', text: 'hi', sentAtMs: 0 }, mkState())).toBe('ok');
  });

  it('duplicate flagged', () => {
    const s = mkState();
    record(s, { peerId: 'p', text: 'hi', sentAtMs: 0 });
    expect(classify({ peerId: 'p', text: 'hi', sentAtMs: 500 }, s)).toBe('duplicate');
  });

  it('flood flagged', () => {
    const s = mkState();
    for (let i = 0; i < MAX_MSGS_PER_WINDOW; i++) {
      record(s, { peerId: 'p', text: `m${i}`, sentAtMs: i * 10 });
    }
    expect(classify({ peerId: 'p', text: 'one more', sentAtMs: 100 }, s)).toBe('flood');
  });

  it('different peer unaffected', () => {
    const s = mkState();
    for (let i = 0; i < 20; i++) record(s, { peerId: 'p', text: `m${i}`, sentAtMs: i });
    expect(classify({ peerId: 'other', text: 'hi', sentAtMs: 100 }, s)).toBe('ok');
  });
});
