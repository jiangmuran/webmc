// Bed sleep animation. The sky fade-to-black + time advance play over
// ~3 seconds with a bezier-ish ease. The player can't move or be
// damaged during the animation; other events are queued and delivered
// on wake.

export type SleepPhase = 'initiating' | 'sleeping' | 'awakening' | 'awake';

export interface SleepAnimState {
  phase: SleepPhase;
  elapsedSec: number;
}

const INITIATING_SEC = 0.5;
const SLEEPING_SEC = 2.5;
const AWAKENING_SEC = 0.5;

export function makeSleepAnim(): SleepAnimState {
  return { phase: 'awake', elapsedSec: 0 };
}

export interface SleepTickResult {
  completed: boolean;
  skippedTime: boolean;
}

export function startSleep(state: SleepAnimState): void {
  state.phase = 'initiating';
  state.elapsedSec = 0;
}

export function tickSleepAnim(state: SleepAnimState, dtSec: number): SleepTickResult {
  if (state.phase === 'awake') return { completed: false, skippedTime: false };
  state.elapsedSec += dtSec;
  switch (state.phase) {
    case 'initiating':
      if (state.elapsedSec >= INITIATING_SEC) {
        state.phase = 'sleeping';
        state.elapsedSec = 0;
      }
      return { completed: false, skippedTime: false };
    case 'sleeping':
      if (state.elapsedSec >= SLEEPING_SEC) {
        state.phase = 'awakening';
        state.elapsedSec = 0;
        return { completed: false, skippedTime: true };
      }
      return { completed: false, skippedTime: false };
    case 'awakening':
      if (state.elapsedSec >= AWAKENING_SEC) {
        state.phase = 'awake';
        state.elapsedSec = 0;
        return { completed: true, skippedTime: false };
      }
      return { completed: false, skippedTime: false };
  }
}

// Fade-to-black amount for the sleep screen: 0..1 where 1 is fully
// black. Eases during the initiating + sleeping phases.
export function sleepFadeAmount(state: SleepAnimState): number {
  switch (state.phase) {
    case 'awake':
      return 0;
    case 'initiating':
      return state.elapsedSec / INITIATING_SEC;
    case 'sleeping':
      return 1;
    case 'awakening':
      return 1 - state.elapsedSec / AWAKENING_SEC;
  }
}

// Can the player be interrupted mid-sleep? Interruption wakes them
// immediately (zombie nearby, damage taken).
export function canInterrupt(state: SleepAnimState): boolean {
  return state.phase === 'initiating' || state.phase === 'sleeping';
}

export function interrupt(state: SleepAnimState): void {
  if (canInterrupt(state)) {
    state.phase = 'awakening';
    state.elapsedSec = 0;
  }
}
