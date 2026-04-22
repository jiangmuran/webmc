// Team system. Each team has a name, color, member set, and a bundle of
// options: friendly fire, see-invisible, collision rules, name tag
// visibility, display prefix/suffix.

export type NameTagVisibility = 'always' | 'never' | 'hideForOtherTeams' | 'hideForOwnTeam';
export type CollisionRule = 'always' | 'never' | 'pushOtherTeams' | 'pushOwnTeam';

export interface TeamOptions {
  color: string;
  prefix: string;
  suffix: string;
  friendlyFire: boolean;
  seeFriendlyInvisibles: boolean;
  nametagVisibility: NameTagVisibility;
  collisionRule: CollisionRule;
}

export interface Team {
  name: string;
  options: TeamOptions;
  members: Set<string>;
}

export function makeTeam(name: string, opts: Partial<TeamOptions> = {}): Team {
  return {
    name,
    options: {
      color: opts.color ?? 'white',
      prefix: opts.prefix ?? '',
      suffix: opts.suffix ?? '',
      friendlyFire: opts.friendlyFire ?? true,
      seeFriendlyInvisibles: opts.seeFriendlyInvisibles ?? true,
      nametagVisibility: opts.nametagVisibility ?? 'always',
      collisionRule: opts.collisionRule ?? 'always',
    },
    members: new Set(),
  };
}

export class TeamRegistry {
  private teams = new Map<string, Team>();
  private membership = new Map<string, string>(); // player → team name

  createTeam(name: string, opts: Partial<TeamOptions> = {}): Team {
    if (this.teams.has(name)) throw new Error(`team exists: ${name}`);
    const t = makeTeam(name, opts);
    this.teams.set(name, t);
    return t;
  }

  removeTeam(name: string): boolean {
    const t = this.teams.get(name);
    if (!t) return false;
    for (const m of t.members) this.membership.delete(m);
    this.teams.delete(name);
    return true;
  }

  addMember(teamName: string, playerId: string): boolean {
    const t = this.teams.get(teamName);
    if (!t) return false;
    const prev = this.membership.get(playerId);
    if (prev) this.teams.get(prev)?.members.delete(playerId);
    t.members.add(playerId);
    this.membership.set(playerId, teamName);
    return true;
  }

  removeMember(playerId: string): boolean {
    const cur = this.membership.get(playerId);
    if (!cur) return false;
    this.teams.get(cur)?.members.delete(playerId);
    this.membership.delete(playerId);
    return true;
  }

  teamOf(playerId: string): Team | null {
    const name = this.membership.get(playerId);
    if (!name) return null;
    return this.teams.get(name) ?? null;
  }

  // Two players share a team?
  sameTeam(a: string, b: string): boolean {
    const ta = this.membership.get(a);
    const tb = this.membership.get(b);
    return ta !== undefined && ta === tb;
  }

  canDamage(attacker: string, target: string): boolean {
    const team = this.teamOf(attacker);
    if (!team) return true;
    if (!this.sameTeam(attacker, target)) return true;
    return team.options.friendlyFire;
  }

  allTeams(): Team[] {
    return Array.from(this.teams.values());
  }
}
