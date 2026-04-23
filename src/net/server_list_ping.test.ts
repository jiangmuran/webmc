import { describe, it, expect } from 'vitest';
import { isCompatible, isFull, formatDisplay, PING_TIMEOUT_MS } from './server_list_ping';

describe('server list ping', () => {
  it('same major compatible', () => {
    expect(isCompatible('1.2', '1.2')).toBe(true);
  });

  it('different major incompat', () => {
    expect(isCompatible('1.0', '2.0')).toBe(false);
  });

  it('close minor compatible', () => {
    expect(isCompatible('1.2', '1.3')).toBe(true);
  });

  it('far minor incompat', () => {
    expect(isCompatible('1.0', '1.5')).toBe(false);
  });

  it('full gates join', () => {
    expect(
      isFull({
        roomCode: 'A',
        hostName: 'H',
        version: '1.0',
        players: 4,
        maxPlayers: 4,
        motd: '',
        latencyMs: 30,
      }),
    ).toBe(true);
  });

  it('display includes counts', () => {
    const s = formatDisplay({
      roomCode: 'A',
      hostName: 'Host',
      version: '1.0',
      players: 1,
      maxPlayers: 4,
      motd: 'hi',
      latencyMs: 0,
    });
    expect(s).toContain('1/4');
  });

  it('timeout > 0', () => {
    expect(PING_TIMEOUT_MS).toBeGreaterThan(0);
  });
});
