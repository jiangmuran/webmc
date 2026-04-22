// Lightning rod. Redirects nearby lightning strikes to itself and emits a
// 15-strength redstone signal for 8 ticks on strike.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface LightningRodState {
  pos: Vec3;
  signalActive: boolean;
  remainingSec: number;
}

const SIGNAL_SEC = 0.4; // 8 redstone ticks
const ATTRACT_RANGE = 128;
const ATTRACT_RADIUS_XZ = 64;

export function makeLightningRod(pos: Vec3): LightningRodState {
  return { pos, signalActive: false, remainingSec: 0 };
}

// Returns the rod position if it's inside the attract zone, or null.
export function attractStrike(
  strikeXZ: { x: number; z: number },
  rods: readonly LightningRodState[],
): LightningRodState | null {
  let best: LightningRodState | null = null;
  let bestDistSq = Infinity;
  for (const rod of rods) {
    const dx = rod.pos.x - strikeXZ.x;
    const dz = rod.pos.z - strikeXZ.z;
    const distSq = dx * dx + dz * dz;
    if (distSq > ATTRACT_RADIUS_XZ * ATTRACT_RADIUS_XZ) continue;
    if (rod.pos.y > ATTRACT_RANGE) continue;
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      best = rod;
    }
  }
  return best;
}

export function fireSignal(state: LightningRodState): void {
  state.signalActive = true;
  state.remainingSec = SIGNAL_SEC;
}

export function tickLightningRod(state: LightningRodState, dtSec: number): void {
  state.remainingSec = Math.max(0, state.remainingSec - dtSec);
  if (state.remainingSec === 0) state.signalActive = false;
}

export function signalStrength(state: LightningRodState): number {
  return state.signalActive ? 15 : 0;
}
