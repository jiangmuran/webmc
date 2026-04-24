export const MAX_ROOMS_PER_SERVER = 200;
export const MAX_PEERS_PER_ROOM = 32;
export const MAX_TRAFFIC_BYTES_PER_PEER_PER_SECOND = 128 * 1024;

export interface ServerStats {
  roomCount: number;
  peersByRoom: Map<string, number>;
  bytesPerPeerPerSecond: Map<string, number>;
}

export function canCreateRoom(s: ServerStats): boolean {
  return s.roomCount < MAX_ROOMS_PER_SERVER;
}

export function canJoinRoom(s: ServerStats, roomId: string): boolean {
  const count = s.peersByRoom.get(roomId) ?? 0;
  return count < MAX_PEERS_PER_ROOM;
}

export function isOverTrafficLimit(s: ServerStats, peerId: string): boolean {
  const bps = s.bytesPerPeerPerSecond.get(peerId) ?? 0;
  return bps > MAX_TRAFFIC_BYTES_PER_PEER_PER_SECOND;
}

export function utilizationPercent(s: ServerStats): number {
  return Math.min(100, Math.round((s.roomCount / MAX_ROOMS_PER_SERVER) * 100));
}
