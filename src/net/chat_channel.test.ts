import { describe, it, expect } from 'vitest';
import { canSend, visibleTo, mentions, type ChatMessage } from './chat_channel';

const base: ChatMessage = {
  sender: 'alice',
  channel: 'global',
  recipient: null,
  text: 'hello',
  timestampMs: 0,
};

describe('chat channel', () => {
  it('canSend basic', () => {
    expect(canSend('hi')).toBe(true);
    expect(canSend('')).toBe(false);
    expect(canSend('x'.repeat(300))).toBe(false);
  });

  it('global visible all', () => {
    expect(visibleTo(base, 'bob', null, null)).toBe(true);
  });

  it('private visible to participants', () => {
    const m: ChatMessage = { ...base, channel: 'private', recipient: 'bob' };
    expect(visibleTo(m, 'bob', null, null)).toBe(true);
    expect(visibleTo(m, 'eve', null, null)).toBe(false);
  });

  it('team visible to same team', () => {
    const m: ChatMessage = { ...base, channel: 'team' };
    expect(visibleTo(m, 'bob', 'red', 'red')).toBe(true);
    expect(visibleTo(m, 'bob', 'blue', 'red')).toBe(false);
  });

  it('mentions detects @', () => {
    expect(mentions({ ...base, text: 'hey @bob' }, 'bob')).toBe(true);
    expect(mentions(base, 'bob')).toBe(false);
  });
});
