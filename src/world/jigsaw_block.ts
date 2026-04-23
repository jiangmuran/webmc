export type JoinRule = 'rollable' | 'aligned';

export interface Jigsaw {
  name: string;
  target: string;
  pool: string;
  finalState: string;
  joinType: JoinRule;
}

export function matches(a: Jigsaw, b: Jigsaw): boolean {
  return a.target === b.name;
}

export function isRollable(j: Jigsaw): boolean {
  return j.joinType === 'rollable';
}

export function becomesOnResolve(j: Jigsaw): string {
  return j.finalState;
}
