// Block break progress. Tracks the fraction of damage dealt to the block
// the player is currently mining. Accumulates at breakTime⁻¹ per second;
// resets if the player switches target or releases the mouse.

export interface BreakTarget {
  x: number;
  y: number;
  z: number;
}

function sameTarget(a: BreakTarget | null, b: BreakTarget | null): boolean {
  if (!a || !b) return a === b;
  return a.x === b.x && a.y === b.y && a.z === b.z;
}

export interface BreakProgressState {
  target: BreakTarget | null;
  progress: number; // 0..1
}

export function makeBreakProgressState(): BreakProgressState {
  return { target: null, progress: 0 };
}

export interface BreakUpdate {
  target: BreakTarget | null;
  holding: boolean;
  breakTimeSec: number;
  dtSec: number;
}

export interface BreakProgressResult {
  broken: boolean;
  fraction: number;
}

export function updateBreakProgress(
  state: BreakProgressState,
  ctx: BreakUpdate,
): BreakProgressResult {
  if (!ctx.holding || !ctx.target) {
    state.target = null;
    state.progress = 0;
    return { broken: false, fraction: 0 };
  }
  if (!sameTarget(state.target, ctx.target)) {
    state.target = ctx.target;
    state.progress = 0;
  }
  if (ctx.breakTimeSec <= 0) {
    state.progress = 1;
    return { broken: true, fraction: 1 };
  }
  state.progress += ctx.dtSec / ctx.breakTimeSec;
  if (state.progress >= 1) {
    state.progress = 0;
    state.target = null;
    return { broken: true, fraction: 1 };
  }
  return { broken: false, fraction: state.progress };
}

// The break-animation stage shown to the player (0..9) matches MC's
// 10-frame crack overlay texture.
export function crackStage(fraction: number): number {
  if (fraction <= 0) return 0;
  if (fraction >= 1) return 9;
  return Math.floor(fraction * 10);
}
