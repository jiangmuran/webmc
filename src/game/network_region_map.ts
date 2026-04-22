// Multiplayer region routing. Different players may be in different
// dimensions; messages/broadcasts are scoped per dim+chunk-region.

export interface RoomPlayer {
  id: string;
  dim: string;
  cx: number;
  cz: number;
}

export interface BroadcastQuery {
  players: RoomPlayer[];
  fromDim: string;
  fromCx: number;
  fromCz: number;
  radiusChunks: number;
}

export function recipientIds(q: BroadcastQuery): string[] {
  const out: string[] = [];
  for (const p of q.players) {
    if (p.dim !== q.fromDim) continue;
    if (
      Math.abs(p.cx - q.fromCx) <= q.radiusChunks &&
      Math.abs(p.cz - q.fromCz) <= q.radiusChunks
    ) {
      out.push(p.id);
    }
  }
  return out;
}

// Chat is global in overworld-only by default.
export function chatRecipients(players: RoomPlayer[], sender: RoomPlayer): string[] {
  return players.filter((p) => p.id !== sender.id).map((p) => p.id);
}
