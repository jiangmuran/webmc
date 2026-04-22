// Screen shake. Triggered by explosions, warden sonic, big falls.
// Shake amplitude decays exponentially.

export interface ShakeState {
  currentAmplitude: number;
  decayPerSec: number;
}

export function makeShake(): ShakeState {
  return { currentAmplitude: 0, decayPerSec: 5 };
}

export function addShake(s: ShakeState, amplitude: number): void {
  s.currentAmplitude = Math.max(s.currentAmplitude, amplitude);
}

export function tickShake(s: ShakeState, deltaSec: number): void {
  s.currentAmplitude = Math.max(0, s.currentAmplitude - s.decayPerSec * deltaSec);
}

// Given amplitude + time, produce a pseudo-random 2D pixel offset.
export function shakeOffset(s: ShakeState, nowMs: number): { x: number; y: number } {
  if (s.currentAmplitude <= 0) return { x: 0, y: 0 };
  const t = nowMs * 0.01;
  return {
    x: Math.sin(t * 2.9) * s.currentAmplitude,
    y: Math.cos(t * 3.1) * s.currentAmplitude,
  };
}

// Suggested amplitudes per source.
export const SHAKE_AMPLITUDE: Record<string, number> = {
  tnt: 5,
  creeper: 7,
  warden_sonic: 10,
  heavy_fall: 3,
};
