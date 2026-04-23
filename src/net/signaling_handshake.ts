// Signaling handshake sequence.
//   client → CREATE_ROOM | JOIN_ROOM <code>
//   server → ROOM_CODE <code> | ROOM_JOINED peerId
//   server forwards OFFER / ANSWER / ICE between peers.

export type SignalingMsg =
  | { kind: 'create_room'; hostName: string }
  | { kind: 'room_code'; code: string; peerId: string }
  | { kind: 'join_room'; code: string; clientName: string }
  | { kind: 'room_joined'; peerId: string; hostPeerId: string }
  | { kind: 'room_error'; reason: 'not_found' | 'full' | 'locked' }
  | { kind: 'relay_offer'; to: string; sdp: string }
  | { kind: 'relay_answer'; to: string; sdp: string }
  | { kind: 'relay_ice'; to: string; candidate: string }
  | { kind: 'peer_left'; peerId: string };

export function isValidHandshake(seq: SignalingMsg[]): boolean {
  if (seq.length < 2) return false;
  const first = seq[0];
  if (!first) return false;
  if (first.kind !== 'create_room' && first.kind !== 'join_room') return false;
  return true;
}

export function opForInput(msg: SignalingMsg): 'server' | 'peer' | 'broadcast' {
  if (msg.kind.startsWith('relay_')) return 'peer';
  if (msg.kind === 'peer_left') return 'broadcast';
  return 'server';
}
