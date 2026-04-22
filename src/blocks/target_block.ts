// Target block. Emits a redstone signal proportional to how close a
// projectile hits the center. Pulse decays over ~20 ticks (1s).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface TargetState {
  signal: number; // 0..15
  remainingSec: number;
}

export function makeTarget(): TargetState {
  return { signal: 0, remainingSec: 0 };
}

const SIGNAL_DURATION_SEC = 1;

// 'distanceToCenter' is the 3D offset from the target's center face (units
// = blocks; max ~0.71 for a corner shot).
export function onProjectileHit(state: TargetState, distanceToCenterFace: number): number {
  // Map 0..0.71 distance → 15..1 signal (bullseye ≈ 15).
  const raw = 15 - Math.floor(distanceToCenterFace * 20);
  const clamped = Math.max(1, Math.min(15, raw));
  state.signal = clamped;
  state.remainingSec = SIGNAL_DURATION_SEC;
  return clamped;
}

export function tickTarget(state: TargetState, dtSec: number): void {
  state.remainingSec = Math.max(0, state.remainingSec - dtSec);
  if (state.remainingSec === 0) state.signal = 0;
}
