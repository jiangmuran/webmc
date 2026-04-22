// Tamed wolf attack targeting. A tamed wolf aggros on the owner's
// attacker and the owner's last-attacked target. A wild wolf pack
// aggros when one of them is hit.

export interface Wolf {
  tamed: boolean;
  ownerId: string | null;
  packId: string | null; // shared id among a spawn pack
  aggroTargetId: string | null;
}

export interface AggroEvent {
  kind: 'owner_attacked_by' | 'owner_attacked' | 'pack_member_hurt' | 'wolf_attacked_by';
  byId: string | null;
  targetId: string | null;
}

export function onEvent(w: Wolf, e: AggroEvent): void {
  if (w.tamed) {
    if (e.kind === 'owner_attacked_by' && e.byId) w.aggroTargetId = e.byId;
    else if (e.kind === 'owner_attacked' && e.targetId) w.aggroTargetId = e.targetId;
    else if (e.kind === 'wolf_attacked_by' && e.byId && e.byId !== w.ownerId) {
      w.aggroTargetId = e.byId;
    }
    return;
  }
  // wild
  if (e.kind === 'pack_member_hurt' && e.byId) w.aggroTargetId = e.byId;
  else if (e.kind === 'wolf_attacked_by' && e.byId) w.aggroTargetId = e.byId;
}

export function clearAggroIfTargetGone(w: Wolf, liveIds: Set<string>): void {
  if (w.aggroTargetId && !liveIds.has(w.aggroTargetId)) w.aggroTargetId = null;
}

// Wolf won't attack owner.
export function canAttack(w: Wolf, targetId: string): boolean {
  if (w.ownerId === targetId) return false;
  return w.aggroTargetId === targetId;
}
