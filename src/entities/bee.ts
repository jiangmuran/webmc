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

// Wiki (minecraft.wiki/w/Bee): "Anger duration is randomly selected
// between 20 and 39 seconds, inclusive." Old constant 25s was within
// the range but never varied. Callers can pass an `rand` (in [0,1))
// to roll a wiki-canonical duration; default keeps the old 25s for
// backwards compat with callers that don't supply an RNG.
export const ANGER_MIN_SEC = 20;
export const ANGER_MAX_SEC = 39;

export function rollAngerSec(rand: () => number): number {
  const span = ANGER_MAX_SEC - ANGER_MIN_SEC + 1;
  return ANGER_MIN_SEC + Math.floor(rand() * span);
}

export function beeAngered(state: BeeState, playerId: number, rand?: () => number): void {
  state.mood = 'angry';
  state.angerSec = rand ? rollAngerSec(rand) : 25;
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
