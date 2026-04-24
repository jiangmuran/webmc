import { describe, it, expect } from 'vitest';
import {
  canCreateRoom,
  canJoinRoom,
  isOverTrafficLimit,
  utilizationPercent,
  MAX_ROOMS_PER_SERVER,
  MAX_PEERS_PER_ROOM,
  MAX_TRAFFIC_BYTES_PER_PEER_PER_SECOND,
  type ServerStats,
} from './signaling_server_capacity';

function mkStats(): ServerStats {
  return { roomCount: 0, peersByRoom: new Map(), bytesPerPeerPerSecond: new Map() };
}

describe('signaling server capacity', () => {
  it('empty server allows rooms', () => {
    expect(canCreateRoom(mkStats())).toBe(true);
  });

  it('full server rejects', () => {
    expect(canCreateRoom({ ...mkStats(), roomCount: MAX_ROOMS_PER_SERVER })).toBe(false);
  });

  it('room with space accepts', () => {
    const s = mkStats();
    s.peersByRoom.set('r1', 1);
    expect(canJoinRoom(s, 'r1')).toBe(true);
  });

  it('full room rejects', () => {
    const s = mkStats();
    s.peersByRoom.set('r1', MAX_PEERS_PER_ROOM);
    expect(canJoinRoom(s, 'r1')).toBe(false);
  });

  it('traffic under limit ok', () => {
    const s = mkStats();
    s.bytesPerPeerPerSecond.set('p', 1000);
    expect(isOverTrafficLimit(s, 'p')).toBe(false);
  });

  it('traffic over limit flagged', () => {
    const s = mkStats();
    s.bytesPerPeerPerSecond.set('p', MAX_TRAFFIC_BYTES_PER_PEER_PER_SECOND + 1);
    expect(isOverTrafficLimit(s, 'p')).toBe(true);
  });

  it('utilization scales', () => {
    expect(utilizationPercent({ ...mkStats(), roomCount: MAX_ROOMS_PER_SERVER / 2 })).toBe(50);
  });
});
