export interface Team {
  name: string;
  members: ReadonlySet<string>;
  friendlyFire: boolean;
  seeInvisibleTeammates: boolean;
}

export function sameTeam(t: Team, a: string, b: string): boolean {
  return t.members.has(a) && t.members.has(b);
}

export function canDamage(t: Team | undefined, attacker: string, victim: string): boolean {
  if (t === undefined) return true;
  if (!sameTeam(t, attacker, victim)) return true;
  return t.friendlyFire;
}

export function canSeeInvisible(t: Team | undefined, a: string, b: string): boolean {
  if (t === undefined) return false;
  return sameTeam(t, a, b) && t.seeInvisibleTeammates;
}
