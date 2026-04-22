// Zombie door break. On hard difficulty zombies can break wooden doors
// over ~60 seconds. Villager zombies have the same behavior.

export type Difficulty = 'peaceful' | 'easy' | 'normal' | 'hard';

export interface ZombieDoorState {
  breakProgressSec: number;
}

export function makeZombieDoorState(): ZombieDoorState {
  return { breakProgressSec: 0 };
}

const BREAK_THRESHOLD_SEC = 60;

export interface DoorBreakCtx {
  dtSec: number;
  difficulty: Difficulty;
  adjacentDoor: boolean;
  doorKind: string;
}

export interface DoorBreakResult {
  breaksDoor: boolean;
}

export function tickZombieDoor(state: ZombieDoorState, ctx: DoorBreakCtx): DoorBreakResult {
  const canBreak =
    ctx.difficulty === 'hard' &&
    ctx.adjacentDoor &&
    ctx.doorKind.endsWith('_door') &&
    !ctx.doorKind.includes('iron');
  if (!canBreak) {
    state.breakProgressSec = 0;
    return { breaksDoor: false };
  }
  state.breakProgressSec += ctx.dtSec;
  if (state.breakProgressSec >= BREAK_THRESHOLD_SEC) {
    state.breakProgressSec = 0;
    return { breaksDoor: true };
  }
  return { breaksDoor: false };
}
