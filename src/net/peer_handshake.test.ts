import { describe, it, expect } from 'vitest';
import {
  generateRoomCode,
  handleClientHello,
  parseRoomCode,
  PROTOCOL_VERSION,
  type HandshakeCtx,
} from './peer_handshake';

const CTX: HandshakeCtx = {
  hello: {
    protocolVersion: PROTOCOL_VERSION,
    playerUuid: 'u1',
    playerName: 'alice',
    clientMods: [],
    wantsChunksRadius: 10,
  },
  maxPlayers: 4,
  currentPlayers: [],
  bannedUuids: new Set(),
  requiredMods: [],
  gameSeed: '1234',
  spawnPos: { x: 0, y: 64, z: 0, dimension: 'overworld' },
  serverMods: [],
};

describe('peer handshake', () => {
  it('accepts valid hello', () => {
    const r = handleClientHello(CTX);
    expect(r.accepted).toBe(true);
  });

  it('rejects bad protocol', () => {
    const r = handleClientHello({
      ...CTX,
      hello: { ...CTX.hello, protocolVersion: 999 },
    });
    expect(r.reason).toBe('bad_protocol');
  });

  it('rejects banned uuid', () => {
    const r = handleClientHello({
      ...CTX,
      bannedUuids: new Set(['u1']),
    });
    expect(r.reason).toBe('banned');
  });

  it('rejects duplicate name', () => {
    const r = handleClientHello({
      ...CTX,
      currentPlayers: [{ uuid: 'u2', name: 'alice' }],
    });
    expect(r.reason).toBe('name_taken');
  });

  it('rejects when full', () => {
    const r = handleClientHello({
      ...CTX,
      maxPlayers: 1,
      currentPlayers: [{ uuid: 'u2', name: 'bob' }],
    });
    expect(r.reason).toBe('server_full');
  });

  it('rejects missing required mod', () => {
    const r = handleClientHello({
      ...CTX,
      requiredMods: ['webmc:mod_a'],
    });
    expect(r.reason).toBe('mod_mismatch');
  });

  it('room code format', () => {
    const code = generateRoomCode(() => 0.5);
    expect(code).toMatch(/^[A-Z2-9]{3}-[A-Z2-9]{3}$/);
  });

  it('parseRoomCode strips dash + validates', () => {
    expect(parseRoomCode('ABC-DEF')).toBe('ABCDEF');
    expect(parseRoomCode('abc-def')).toBe('ABCDEF');
    expect(parseRoomCode('too-short')).toBeNull();
  });

  it('rejects confusable chars', () => {
    expect(parseRoomCode('AB0-DEF')).toBeNull();
  });
});
