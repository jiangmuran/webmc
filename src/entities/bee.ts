// Bee state machine. Bees wander to flowers + pollinate; return home to
// a nest + deposit pollination; become angry when attacked or when their
// hive is broken without a campfire underneath.

export type BeeMood = 'wander' | 'seek_flower' | 'pollinate' | 'return_home' | 'angry';

export interface BeeState {
  mood: BeeMood;
  pollinated: boolean;
  homeNestPos: { x: number; y: number; z: number } | null;
  angerSec: number;
  recentStingPlayerId: number | null;
}

export function makeBee(homeNest?: { x: number; y: number; z: number }): BeeState {
  return {
    mood: 'wander',
    pollinated: false,
    homeNestPos: homeNest ?? null,
    angerSec: 0,
    recentStingPlayerId: null,
  };
}

export function beeAngered(state: BeeState, playerId: number): void {
  state.mood = 'angry';
  state.angerSec = 25;
  state.recentStingPlayerId = playerId;
}

// Bees sting once, then die 1 minute later.
export interface StingResult {
  damageDealt: number;
  beeDies: boolean;
}

export function sting(state: BeeState): StingResult {
  if (state.mood !== 'angry') return { damageDealt: 0, beeDies: false };
  state.mood = 'wander';
  state.angerSec = 0;
  return { damageDealt: 2, beeDies: true };
}

export function beePollinate(state: BeeState): void {
  state.pollinated = true;
  state.mood = state.homeNestPos ? 'return_home' : 'wander';
}

export function depositAtNest(state: BeeState): boolean {
  if (!state.pollinated) return false;
  state.pollinated = false;
  state.mood = 'wander';
  return true;
}

export function tickBee(state: BeeState, dtSec: number): void {
  state.angerSec = Math.max(0, state.angerSec - dtSec);
  if (state.angerSec === 0 && state.mood === 'angry') {
    state.mood = 'wander';
    state.recentStingPlayerId = null;
  }
}
