import { describe, it, expect } from 'vitest';
import { isValidHandshake, opForInput } from './signaling_handshake';

describe('signaling handshake', () => {
  it('must start with create/join', () => {
    expect(
      isValidHandshake([
        { kind: 'create_room', hostName: 'host' },
        { kind: 'room_code', code: 'ABC', peerId: '1' },
      ]),
    ).toBe(true);
  });

  it('invalid starting msg', () => {
    expect(
      isValidHandshake([
        { kind: 'relay_offer', to: 'x', sdp: '' },
        { kind: 'relay_answer', to: 'y', sdp: '' },
      ]),
    ).toBe(false);
  });

  it('opForInput classifies', () => {
    expect(opForInput({ kind: 'relay_offer', to: 'x', sdp: '' })).toBe('peer');
    expect(opForInput({ kind: 'peer_left', peerId: 'x' })).toBe('broadcast');
    expect(opForInput({ kind: 'create_room', hostName: 'h' })).toBe('server');
  });
});
