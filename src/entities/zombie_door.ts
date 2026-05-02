// Zombie door break. On hard difficulty zombies can break wooden doors.
// Villager zombies have the same behavior.
//
// Wiki (minecraft.wiki/w/Zombie): "Zombies on hard difficulty break
// wooden doors after ~240 ticks (12 seconds) of continuous attack."
// Old BREAK_THRESHOLD_SEC=60 was 5× the wiki value, so zombies took
// a minute instead of 12 s to break a wooden door. Sibling
// zombie_break_door.ts already uses 240 ticks.

export type Difficulty = 'peaceful' | 'easy' | 'normal' | 'hard';

export interface ZombieDoorState {
  breakProgressSec: number;
}

export function makeZombieDoorState(): ZombieDoorState {
  return { breakProgressSec: 0 };
}

const BREAK_THRESHOLD_SEC = 12;

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
