// World difficulty lock. When locked, the difficulty cannot be changed
// for the world's lifetime. Useful for hardcore.

export interface WorldDifficulty {
  current: 'peaceful' | 'easy' | 'normal' | 'hard';
  locked: boolean;
  hardcore: boolean;
}

export function makeDifficulty(): WorldDifficulty {
  return { current: 'normal', locked: false, hardcore: false };
}

export function setDifficulty(w: WorldDifficulty, d: WorldDifficulty['current']): boolean {
  if (w.locked) return false;
  if (w.hardcore && d !== 'hard') return false;
  w.current = d;
  return true;
}

export function lock(w: WorldDifficulty): boolean {
  if (w.locked) return false;
  w.locked = true;
  return true;
}

export function enableHardcore(w: WorldDifficulty): void {
  w.hardcore = true;
  w.current = 'hard';
  w.locked = true;
}

// Hardcore death = world becomes spectator-only permanent.
export function hardcoreOnDeath(w: WorldDifficulty): 'spectator_lock' | null {
  return w.hardcore ? 'spectator_lock' : null;
}
