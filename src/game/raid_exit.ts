// Raid boundary enforcement. Raiders that wander more than 96 blocks
// from the village center for longer than 30s are teleported back. If
// all raiders are more than 96 blocks away simultaneously (nobody to
// fight), the raid declares "defeated" and awards hero-of-the-village.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Raider {
  id: number;
  position: Vec3;
  secondsOutOfBounds: number;
}

export const RAID_RADIUS = 96;
export const STRAY_TIMEOUT_SEC = 30;

export interface RaidState {
  center: Vec3;
  raiders: Map<number, Raider>;
}

export function makeRaidState(center: Vec3): RaidState {
  return { center: { ...center }, raiders: new Map() };
}

export function addRaider(state: RaidState, raider: Raider): void {
  state.raiders.set(raider.id, raider);
}

export function removeRaider(state: RaidState, id: number): boolean {
  return state.raiders.delete(id);
}

export interface RaidTickResult {
  teleportBack: readonly number[];
  defeated: boolean;
}

export function tickRaidBoundary(state: RaidState, dtSec: number): RaidTickResult {
  const teleport: number[] = [];
  let anyNear = false;
  for (const r of state.raiders.values()) {
    const dx = r.position.x - state.center.x;
    const dy = r.position.y - state.center.y;
    const dz = r.position.z - state.center.z;
    const dist = Math.hypot(dx, dy, dz);
    if (dist <= RAID_RADIUS) {
      anyNear = true;
      r.secondsOutOfBounds = 0;
    } else {
      r.secondsOutOfBounds += dtSec;
      if (r.secondsOutOfBounds >= STRAY_TIMEOUT_SEC) {
        teleport.push(r.id);
        r.secondsOutOfBounds = 0;
      }
    }
  }
  const defeated = state.raiders.size === 0 || (!anyNear && state.raiders.size <= 2);
  return { teleportBack: teleport, defeated };
}

// Teleport destination: random point inside the raid radius.
export function pickTeleportPoint(center: Vec3, rng: () => number): Vec3 {
  const angle = rng() * Math.PI * 2;
  const dist = rng() * RAID_RADIUS * 0.6;
  return {
    x: Math.round(center.x + Math.cos(angle) * dist),
    y: center.y,
    z: Math.round(center.z + Math.sin(angle) * dist),
  };
}
