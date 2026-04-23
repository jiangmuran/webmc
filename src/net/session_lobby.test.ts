import { describe, it, expect } from 'vitest';
import { isFull, canJoin, addPeer, removePeer, peerCount, type LobbyState } from './session_lobby';

function mk(): LobbyState {
  return {
    roomCode: 'ABC123',
    hostName: 'Host',
    maxPlayers: 4,
    peers: [],
    gameMode: 'survival',
    difficulty: 'normal',
    locked: false,
  };
}

describe('session lobby', () => {
  it('empty not full', () => {
    expect(isFull(mk())).toBe(false);
  });

  it('fill to cap', () => {
    const l = mk();
    for (let i = 0; i < 4; i++) addPeer(l, { id: `p${i}`, name: `P${i}`, latencyMs: 50 });
    expect(isFull(l)).toBe(true);
    expect(canJoin(l)).toBe(false);
  });

  it('locked blocks join', () => {
    const l = { ...mk(), locked: true };
    expect(addPeer(l, { id: 'x', name: 'X', latencyMs: 0 })).toBe(false);
  });

  it('remove peer', () => {
    const l = mk();
    addPeer(l, { id: 'p1', name: 'A', latencyMs: 0 });
    expect(removePeer(l, 'p1')).toBe(true);
    expect(peerCount(l)).toBe(0);
  });
});
