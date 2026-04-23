import { describe, it, expect } from 'vitest';
import { iceServers, hasTurnCredentials } from './stun_turn_resolution';

describe('stun turn resolution', () => {
  it('stun-only no turn', () => {
    const list = { stun: ['stun:x.com'], turn: [] };
    expect(hasTurnCredentials(list)).toBe(false);
    expect(iceServers(list)).toHaveLength(1);
  });

  it('turn includes credentials', () => {
    const list = {
      stun: [],
      turn: [{ url: 'turn:t.com', username: 'u', credential: 'p' }],
    };
    const s = iceServers(list);
    expect(s[0]?.username).toBe('u');
  });
});
