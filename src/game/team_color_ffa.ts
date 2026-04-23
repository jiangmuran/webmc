export type TeamColor = 'red' | 'blue' | 'yellow' | 'green' | 'aqua' | 'white' | 'none';

export interface PlayerTeam {
  playerId: string;
  team: TeamColor;
}

export function sameTeam(a: PlayerTeam, b: PlayerTeam): boolean {
  if (a.team === 'none' || b.team === 'none') return false;
  return a.team === b.team;
}

export function canAttack(a: PlayerTeam, b: PlayerTeam, friendlyFire: boolean): boolean {
  if (a.playerId === b.playerId) return false;
  if (sameTeam(a, b)) return friendlyFire;
  return true;
}
