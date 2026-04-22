// Peer role election. webmc is host-authoritative; the first peer in
// a room simulates the world, others are clients. Role changes when the
// host disconnects: either the session ends (MVP), or a pre-determined
// "co-host" is promoted (M10+).

export type PeerRole = 'host' | 'client' | 'co_host';

export interface PeerInfo {
  peerId: string;
  uuid: string;
  name: string;
  joinedAtSec: number;
  role: PeerRole;
  isCoHost: boolean; // true = eligible for promotion on host leave
}

export class RoomState {
  private readonly peers = new Map<string, PeerInfo>();
  private hostId: string | null = null;

  join(info: Omit<PeerInfo, 'role' | 'isCoHost'>, isCoHost = false): PeerRole {
    const role: PeerRole = this.hostId === null ? 'host' : 'client';
    const full: PeerInfo = { ...info, role, isCoHost };
    this.peers.set(info.peerId, full);
    if (role === 'host') this.hostId = info.peerId;
    return role;
  }

  leave(peerId: string): 'host_left' | 'normal_leave' | 'not_present' {
    const p = this.peers.get(peerId);
    if (!p) return 'not_present';
    this.peers.delete(peerId);
    if (p.role === 'host') {
      this.hostId = null;
      return 'host_left';
    }
    return 'normal_leave';
  }

  // Promote the first co-host (ordered by join time) to host.
  promoteCoHost(): PeerInfo | null {
    if (this.hostId !== null) return null;
    const candidates = Array.from(this.peers.values())
      .filter((p) => p.isCoHost)
      .sort((a, b) => a.joinedAtSec - b.joinedAtSec);
    const next = candidates[0];
    if (!next) return null;
    next.role = 'host';
    this.hostId = next.peerId;
    return next;
  }

  host(): PeerInfo | null {
    if (!this.hostId) return null;
    return this.peers.get(this.hostId) ?? null;
  }

  clients(): PeerInfo[] {
    return Array.from(this.peers.values()).filter((p) => p.role === 'client');
  }

  all(): PeerInfo[] {
    return Array.from(this.peers.values());
  }

  peer(peerId: string): PeerInfo | null {
    return this.peers.get(peerId) ?? null;
  }

  setCoHost(peerId: string, value: boolean): boolean {
    const p = this.peers.get(peerId);
    if (!p) return false;
    p.isCoHost = value;
    return true;
  }
}
