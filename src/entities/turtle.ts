// Turtle. Lays eggs on the beach where it was born; eggs hatch into
// babies after ~2 in-game nights; babies grow into adults over 20 MC
// minutes, dropping a scute at transformation.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type TurtleStance = 'idle' | 'swimming' | 'heading_home' | 'laying_eggs' | 'dead';

export interface TurtleState {
  id: number;
  position: Vec3;
  homeBeach: Vec3;
  stance: TurtleStance;
  pregnant: boolean;
  adult: boolean;
  growTicks: number;
  health: number;
}

export const TURTLE_MAX_HEALTH = 30;
const GROW_TICKS_TO_ADULT = 24000; // 20 MC minutes

export function makeTurtle(id: number, at: Vec3, homeBeach: Vec3, adult = true): TurtleState {
  return {
    id,
    position: { ...at },
    homeBeach: { ...homeBeach },
    stance: 'idle',
    pregnant: false,
    adult,
    growTicks: 0,
    health: TURTLE_MAX_HEALTH,
  };
}

// Eggs hatch when: on sand, during night, after 2 in-game nights.
export interface EggState {
  age: number; // ticks
  crackedStage: 0 | 1 | 2 | 3; // 3 = hatched
  position: Vec3;
}

export function makeEgg(pos: Vec3): EggState {
  return { age: 0, crackedStage: 0, position: { ...pos } };
}

const CRACK_TICKS = 8000; // ~6.6 min
const HATCH_TICKS = 24000; // 2 nights

export function tickEgg(
  egg: EggState,
  isNight: boolean,
  dtTicks: number,
): 'no_change' | 'cracked' | 'hatched' {
  if (!isNight) return 'no_change';
  egg.age += dtTicks;
  if (egg.age >= HATCH_TICKS) {
    egg.crackedStage = 3;
    return 'hatched';
  }
  const wantedStage = Math.min(2, Math.floor(egg.age / CRACK_TICKS));
  if (wantedStage > egg.crackedStage) {
    egg.crackedStage = wantedStage as 1 | 2;
    return 'cracked';
  }
  return 'no_change';
}

export interface TurtleGrowResult {
  justBecameAdult: boolean;
  scuteDropped: boolean;
}

export function tickGrowth(state: TurtleState, dtTicks: number): TurtleGrowResult {
  if (state.adult) return { justBecameAdult: false, scuteDropped: false };
  state.growTicks += dtTicks;
  if (state.growTicks >= GROW_TICKS_TO_ADULT) {
    state.adult = true;
    return { justBecameAdult: true, scuteDropped: true };
  }
  return { justBecameAdult: false, scuteDropped: false };
}

export function impregnate(state: TurtleState): boolean {
  if (!state.adult) return false;
  state.pregnant = true;
  return true;
}

// Returns true if the turtle is at its home beach and can lay.
export function layEggs(state: TurtleState): { laid: number } | null {
  if (!state.pregnant || !state.adult) return null;
  const dx = state.position.x - state.homeBeach.x;
  const dz = state.position.z - state.homeBeach.z;
  if (Math.hypot(dx, dz) > 2) return null;
  state.pregnant = false;
  return { laid: 1 + Math.floor(Math.random() * 4) };
}
