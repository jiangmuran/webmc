// Jungle pyramid puzzle: 3 redstone levers set 2 dispensers + reveal
// chest. Incorrect combo triggers arrow traps.

export const LEVER_COUNT = 3;
export const COMBINATIONS = 2 ** LEVER_COUNT;

export interface LeverState {
  levers: [boolean, boolean, boolean];
}

export function isSolved(s: LeverState, answer: [boolean, boolean, boolean]): boolean {
  return s.levers[0] === answer[0] && s.levers[1] === answer[1] && s.levers[2] === answer[2];
}

export function flip(s: LeverState, idx: 0 | 1 | 2): LeverState {
  const n: [boolean, boolean, boolean] = [...s.levers];
  n[idx] = !n[idx];
  return { levers: n };
}

export const ARROW_DISPENSER_COUNT = 2;
export const HIDDEN_CHEST_COUNT = 2;
