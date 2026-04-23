export interface ProgressState {
  unlocked: Set<string>;
}

export function unlock(state: ProgressState, id: string): ProgressState {
  if (state.unlocked.has(id)) return state;
  const next = new Set(state.unlocked);
  next.add(id);
  return { unlocked: next };
}

export function isUnlocked(s: ProgressState, id: string): boolean {
  return s.unlocked.has(id);
}

export function prerequisitesMet(
  s: ProgressState,
  requires: string[],
): boolean {
  return requires.every((r) => s.unlocked.has(r));
}
