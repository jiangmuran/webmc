// Big + small dripleaf. Small drips grow into big ones on clay / moss.
// Big dripleaves tilt under weight after 1 second of a standing entity,
// then return to horizontal.

export interface SmallDripleafState {
  growthStage: number; // 0..3
}

export interface BigDripleafState {
  tilt: 'none' | 'unstable' | 'partial' | 'full';
  tiltTimerSec: number;
  entityOnTop: boolean;
}

export function makeSmall(): SmallDripleafState {
  return { growthStage: 0 };
}

export function growSmall(
  state: SmallDripleafState,
  onSuitableSoil: boolean,
  rng: () => number = Math.random,
): boolean {
  if (!onSuitableSoil) return false;
  if (state.growthStage >= 3) return false;
  if (rng() < 0.07) {
    state.growthStage++;
    return true;
  }
  return false;
}

export function canTransformToBig(state: SmallDripleafState): boolean {
  return state.growthStage >= 3;
}

export function makeBig(): BigDripleafState {
  return { tilt: 'none', tiltTimerSec: 0, entityOnTop: false };
}

export function tickBigDripleaf(state: BigDripleafState, dtSec: number): void {
  if (state.entityOnTop) {
    state.tiltTimerSec += dtSec;
    if (state.tiltTimerSec >= 1) {
      // Progressive tilt over ~1.5s.
      if (state.tiltTimerSec < 1.3) state.tilt = 'unstable';
      else if (state.tiltTimerSec < 1.5) state.tilt = 'partial';
      else state.tilt = 'full';
    }
  } else {
    state.tiltTimerSec = 0;
    state.tilt = 'none';
  }
}

export function setEntityOnTop(state: BigDripleafState, value: boolean): void {
  state.entityOnTop = value;
}

// Returns true when the leaf has fully dropped — caller drops the entity
// through.
export function isFallenThrough(state: BigDripleafState): boolean {
  return state.tilt === 'full';
}
