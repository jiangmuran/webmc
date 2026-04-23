import { describe, it, expect } from 'vitest';
import { encode, decode } from './peer_discovery_lan';

describe('peer discovery lan', () => {
  it('roundtrip', () => {
    const msg = { roomCode: 'abc', motd: 'hi there', hostName: 'host', portHint: 25565 };
    const out = decode(encode(msg));
    expect(out).toEqual(msg);
  });

  it('rejects unknown version', () => {
    expect(decode('other-proto/1|x|y|25565|motd')).toBeUndefined();
  });

  it('rejects too short', () => {
    expect(decode('webmc-lan/1|abc')).toBeUndefined();
  });

  it('motd may contain pipes', () => {
    const msg = { roomCode: 'abc', motd: 'a|b|c', hostName: 'host', portHint: 25565 };
    expect(decode(encode(msg))?.motd).toBe('a|b|c');
  });
});
