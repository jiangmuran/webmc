// PvP team damage. Players on the same team have friendly fire
// disabled (unless team.allowFriendlyFire = true). Self-damage always
// applies.

export interface Team {
  id: string;
  allowFriendlyFire: boolean;
  members: Set<string>;
}

export interface DamageQuery {
  attackerId: string | null;
  targetId: string;
  teams: Team[];
  pvpGlobal: boolean; // server-wide PvP flag
}

export function shouldApply(q: DamageQuery): boolean {
  if (!q.pvpGlobal) return q.attackerId === null;
  if (q.attackerId === null) return true;
  if (q.attackerId === q.targetId) return true;
  for (const t of q.teams) {
    if (t.members.has(q.attackerId) && t.members.has(q.targetId)) {
      return t.allowFriendlyFire;
    }
  }
  return true;
}
