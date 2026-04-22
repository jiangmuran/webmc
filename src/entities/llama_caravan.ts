// Llama caravans. A leashed llama pulls up to 10 followers, each
// chaining to the one in front. Breaks if front llama is killed or
// leash snaps.

export interface Llama {
  id: string;
  leadingId: string | null; // llama ahead
  followerId: string | null; // llama behind
  leashedToPlayerId: string | null;
}

export const MAX_CARAVAN = 10;

export function makeLlama(id: string): Llama {
  return { id, leadingId: null, followerId: null, leashedToPlayerId: null };
}

export function joinCaravan(leader: Llama, follower: Llama): boolean {
  if (follower.leadingId !== null) return false;
  if (leader.followerId !== null) return false;
  // count chain forward from follower? simple prune — assume caller validates length.
  leader.followerId = follower.id;
  follower.leadingId = leader.id;
  return true;
}

export function leaveCaravan(l: Llama, all: Map<string, Llama>): void {
  if (l.leadingId !== null) {
    const ahead = all.get(l.leadingId);
    if (ahead) ahead.followerId = null;
  }
  if (l.followerId !== null) {
    const behind = all.get(l.followerId);
    if (behind) behind.leadingId = null;
  }
  l.leadingId = null;
  l.followerId = null;
}

export function caravanLength(head: Llama, all: Map<string, Llama>): number {
  let n = 1;
  let cur = head;
  while (cur.followerId !== null) {
    const next = all.get(cur.followerId);
    if (!next) break;
    cur = next;
    n += 1;
    if (n > MAX_CARAVAN * 2) break; // safety
  }
  return n;
}
