// Bell — rings on interaction / redstone pulse. While ringing, it reveals
// nearby raiders on a map-like glow effect within 48 blocks, and villagers
// flee home at the sound.

export interface BellState {
  ringingSec: number;
  // last ring direction (axis + facing) drives the swing animation.
  facing: 'north' | 'south' | 'east' | 'west';
}

const RING_DURATION_SEC = 2;
const RAIDER_REVEAL_RANGE = 48;

export function makeBell(): BellState {
  return { ringingSec: 0, facing: 'north' };
}

export function ringBell(state: BellState, facing?: BellState['facing']): boolean {
  if (state.ringingSec > 0) return false;
  state.ringingSec = RING_DURATION_SEC;
  if (facing) state.facing = facing;
  return true;
}

export function tickBell(state: BellState, dtSec: number): void {
  state.ringingSec = Math.max(0, state.ringingSec - dtSec);
}

export interface RaiderReveal {
  entityId: number;
  revealSec: number;
}

// Returns all raiders within range to reveal them on the map UI for 3s.
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function raidersToReveal(
  bellPos: Vec3,
  raiders: readonly { id: number; position: Vec3 }[],
): RaiderReveal[] {
  const out: RaiderReveal[] = [];
  for (const r of raiders) {
    const dx = r.position.x - bellPos.x;
    const dy = r.position.y - bellPos.y;
    const dz = r.position.z - bellPos.z;
    if (Math.hypot(dx, dy, dz) <= RAIDER_REVEAL_RANGE) {
      out.push({ entityId: r.id, revealSec: 3 });
    }
  }
  return out;
}
