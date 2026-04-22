// Scoreboard + team system. Useful for server-like game modes and the
// "statistics" panel. Supports named objectives (kills, deaths, ore mined)
// that track per-player scores + named teams with shared colour.

export interface Objective {
  id: string;
  displayName: string;
  criteria: string; // 'kills' / 'deaths' / 'custom:blocks_mined:stone' etc.
}

export interface Team {
  id: string;
  displayName: string;
  color: string; // e.g. '#ff0000'
  members: Set<string>;
  friendlyFire: boolean;
  seeFriendlyInvisibles: boolean;
}

export class Scoreboard {
  private readonly objectives = new Map<string, Objective>();
  private readonly scores = new Map<string, Map<string, number>>(); // objId → playerId → score
  private readonly teams = new Map<string, Team>();
  private readonly playerTeams = new Map<string, string>(); // playerId → teamId

  addObjective(obj: Objective): void {
    this.objectives.set(obj.id, obj);
    this.scores.set(obj.id, new Map());
  }

  removeObjective(id: string): void {
    this.objectives.delete(id);
    this.scores.delete(id);
  }

  setScore(objId: string, playerId: string, score: number): void {
    const m = this.scores.get(objId);
    if (!m) throw new Error(`no objective ${objId}`);
    m.set(playerId, score);
  }

  addScore(objId: string, playerId: string, delta: number): void {
    const cur = this.getScore(objId, playerId);
    this.setScore(objId, playerId, cur + delta);
  }

  getScore(objId: string, playerId: string): number {
    return this.scores.get(objId)?.get(playerId) ?? 0;
  }

  topScores(objId: string, limit = 10): readonly { player: string; score: number }[] {
    const m = this.scores.get(objId);
    if (!m) return [];
    return Array.from(m, ([player, score]) => ({ player, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  addTeam(team: Omit<Team, 'members'>): void {
    this.teams.set(team.id, { ...team, members: new Set() });
  }

  removeTeam(id: string): void {
    const t = this.teams.get(id);
    if (t) for (const p of t.members) this.playerTeams.delete(p);
    this.teams.delete(id);
  }

  assignPlayer(teamId: string, playerId: string): void {
    const team = this.teams.get(teamId);
    if (!team) throw new Error(`no team ${teamId}`);
    // Remove from previous team.
    const prev = this.playerTeams.get(playerId);
    if (prev) this.teams.get(prev)?.members.delete(playerId);
    team.members.add(playerId);
    this.playerTeams.set(playerId, teamId);
  }

  teamOf(playerId: string): Team | null {
    const id = this.playerTeams.get(playerId);
    if (!id) return null;
    return this.teams.get(id) ?? null;
  }

  canDamage(attacker: string, target: string): boolean {
    const a = this.teamOf(attacker);
    const t = this.teamOf(target);
    if (!a || !t) return true;
    if (a.id !== t.id) return true;
    return a.friendlyFire;
  }

  get objectiveIds(): readonly string[] {
    return Array.from(this.objectives.keys());
  }

  get teamIds(): readonly string[] {
    return Array.from(this.teams.keys());
  }
}
