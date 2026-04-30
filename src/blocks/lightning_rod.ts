// Lightning rod. Redirects nearby lightning strikes to itself and emits a
// 15-strength redstone signal for 8 ticks on strike.
//
// Wiki (minecraft.wiki/w/Lightning_Rod): "Lightning rods that are
// the highest block in the column redirect lightning strikes within
// a spherical volume, having a radius of 128 blocks in Java Edition
// and 64 blocks in Bedrock Edition."
//
// Old code modeled a CYLINDER (XZ radius 64, Y range 128) — a strict
// subset of the wiki's 128-sphere on the XZ plane (rod at high Y
// could attract a strike from <=128 vertical distance but the XZ
// check capped at 64). webmc targets Java per AGENT_CHARTER, so
// ATTRACT_RADIUS = 128 spherical.

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
export const ATTRACT_RADIUS = 128;

export function makeLightningRod(pos: Vec3): LightningRodState {
  return { pos, signalActive: false, remainingSec: 0 };
}

// Returns the rod inside the spherical attract zone closest to the strike,
// or null if none. The strike's Y coordinate is the rod's Y (lightning bolts
// originate at cloud height and target the same column the rod is in).
export function attractStrike(
  strike: { x: number; y?: number; z: number },
  rods: readonly LightningRodState[],
): LightningRodState | null {
  let best: LightningRodState | null = null;
  let bestDistSq = Infinity;
  const sy = strike.y ?? 0;
  const r2 = ATTRACT_RADIUS * ATTRACT_RADIUS;
  for (const rod of rods) {
    const dx = rod.pos.x - strike.x;
    const dy = rod.pos.y - sy;
    const dz = rod.pos.z - strike.z;
    const distSq = dx * dx + dy * dy + dz * dz;
    if (distSq > r2) continue;
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
