import { describe, it, expect } from 'vitest';
import { handleChat, parseFormatting } from './chat_protocol';

const ALLOW = { allow: () => true };
const DENY = { allow: () => false };

describe('chat handling', () => {
  it('broadcasts a normal message', () => {
    const r = handleChat({ senderId: 'p1', body: 'hi', nowSec: 0 }, ALLOW);
    expect(r).toMatchObject({ kind: 'chat', body: 'hi' });
  });

  it('rejects empty', () => {
    const r = handleChat({ senderId: 'p1', body: '   ', nowSec: 0 }, ALLOW);
    expect(r).toMatchObject({ reason: 'empty' });
  });

  it('rejects over length', () => {
    const r = handleChat({ senderId: 'p1', body: 'x'.repeat(1000), nowSec: 0 }, ALLOW);
    expect(r).toMatchObject({ reason: 'too_long' });
  });

  it('rejects control chars', () => {
    const r = handleChat({ senderId: 'p1', body: 'ab', nowSec: 0 }, ALLOW);
    expect(r).toMatchObject({ reason: 'malformed' });
  });

  it('rejects when limiter denies', () => {
    const r = handleChat({ senderId: 'p1', body: 'hi', nowSec: 0 }, DENY);
    expect(r).toMatchObject({ reason: 'rate_limited' });
  });

  it('parses commands', () => {
    const r = handleChat({ senderId: 'p1', body: '/tp 1 2 3', nowSec: 0 }, ALLOW);
    expect(r).toMatchObject({ kind: 'command', name: 'tp', args: ['1', '2', '3'] });
  });
});

describe('chat formatting', () => {
  it('splits color runs', () => {
    const runs = parseFormatting('§cred§atext');
    expect(runs.length).toBe(2);
    expect(runs[0]?.color).toBe('c');
    expect(runs[1]?.color).toBe('a');
  });

  it('bold + italic stack', () => {
    const runs = parseFormatting('§l§obold');
    expect(runs[0]?.bold).toBe(true);
    expect(runs[0]?.italic).toBe(true);
  });

  it('§r resets', () => {
    const runs = parseFormatting('§cred§rplain');
    const last = runs[runs.length - 1];
    expect(last?.color).toBeNull();
  });
});
