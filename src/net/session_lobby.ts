// Pre-join session lobby. Players see host name, room code, peer count.

export interface LobbyState {
  roomCode: string;
  hostName: string;
  maxPlayers: number;
  peers: { id: string; name: string; latencyMs: number }[];
  gameMode: 'survival' | 'creative' | 'adventure';
  difficulty: 'easy' | 'normal' | 'hard';
  locked: boolean;
}

export function isFull(l: LobbyState): boolean {
  return l.peers.length >= l.maxPlayers;
}

export function canJoin(l: LobbyState): boolean {
  return !l.locked && !isFull(l);
}

export function addPeer(
  l: LobbyState,
  peer: { id: string; name: string; latencyMs: number },
): boolean {
  if (!canJoin(l)) return false;
  l.peers.push(peer);
  return true;
}

export function removePeer(l: LobbyState, id: string): boolean {
  const before = l.peers.length;
  l.peers = l.peers.filter((p) => p.id !== id);
  return l.peers.length < before;
}

export function peerCount(l: LobbyState): number {
  return l.peers.length;
}
