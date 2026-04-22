import { describe, it, expect } from 'vitest';
import { CommandRegistry, parseCommand } from './chat_commands';

describe('chat commands', () => {
  it('parseCommand extracts name + args', () => {
    expect(parseCommand('/tp alice 0 60 0')).toEqual({
      name: 'tp',
      args: ['alice', '0', '60', '0'],
    });
  });

  it('non-slash returns null', () => {
    expect(parseCommand('hello')).toBeNull();
  });

  it('empty after slash returns null', () => {
    expect(parseCommand('/')).toBeNull();
  });

  it('dispatch runs handler', () => {
    const r = new CommandRegistry();
    r.register({
      name: 'hello',
      aliases: [],
      args: [],
      minOpLevel: 0,
      handler: () => ({ ok: true, message: 'hi' }),
    });
    const result = r.dispatch('hello', [], {
      senderId: 'p1',
      senderOpLevel: 0,
      players: [],
      nowSec: 0,
    });
    expect(result.ok).toBe(true);
  });

  it('unknown command', () => {
    const r = new CommandRegistry();
    const res = r.dispatch('xyz', [], {
      senderId: 'p1',
      senderOpLevel: 0,
      players: [],
      nowSec: 0,
    });
    expect(res).toMatchObject({ reason: 'unknown' });
  });

  it('non-op blocked', () => {
    const r = new CommandRegistry();
    r.register({
      name: 'ban',
      aliases: [],
      args: ['player'],
      minOpLevel: 3,
      handler: () => ({ ok: true, message: 'ok' }),
    });
    const res = r.dispatch('ban', ['alice'], {
      senderId: 'p1',
      senderOpLevel: 0,
      players: [],
      nowSec: 0,
    });
    expect(res).toMatchObject({ reason: 'not_op' });
  });

  it('integer arg validation', () => {
    const r = new CommandRegistry();
    r.register({
      name: 'settime',
      aliases: [],
      args: ['integer'],
      minOpLevel: 0,
      handler: () => ({ ok: true, message: 'ok' }),
    });
    const res = r.dispatch('settime', ['abc'], {
      senderId: 'p1',
      senderOpLevel: 0,
      players: [],
      nowSec: 0,
    });
    expect(res).toMatchObject({ reason: 'bad_args' });
  });

  it('aliases dispatch too', () => {
    const r = new CommandRegistry();
    r.register({
      name: 'gamemode',
      aliases: ['gm'],
      args: ['string'],
      minOpLevel: 0,
      handler: () => ({ ok: true, message: 'set' }),
    });
    expect(
      r.dispatch('gm', ['creative'], {
        senderId: 'p1',
        senderOpLevel: 0,
        players: [],
        nowSec: 0,
      }).ok,
    ).toBe(true);
  });
});
