export type DisplaySlot = 'sidebar' | 'list' | 'below_name';

export interface Objective {
  name: string;
  criterion: string;
  displayName: string;
}

export interface Scoreboard {
  objectives: Map<string, Objective>;
  scores: Map<string, Map<string, number>>;
  displays: Map<DisplaySlot, string>;
}

export function createBoard(): Scoreboard {
  return { objectives: new Map(), scores: new Map(), displays: new Map() };
}

export function addObjective(b: Scoreboard, o: Objective): void {
  b.objectives.set(o.name, o);
  if (!b.scores.has(o.name)) b.scores.set(o.name, new Map());
}

export function setScore(b: Scoreboard, objective: string, target: string, value: number): void {
  const m = b.scores.get(objective);
  if (m === undefined) return;
  m.set(target, value);
}

export function getScore(b: Scoreboard, objective: string, target: string): number | undefined {
  return b.scores.get(objective)?.get(target);
}

export function sidebarLines(b: Scoreboard): readonly [string, number][] {
  const name = b.displays.get('sidebar');
  if (name === undefined) return [];
  const m = b.scores.get(name);
  if (m === undefined) return [];
  return [...m.entries()].sort((a, z) => z[1] - a[1]);
}
