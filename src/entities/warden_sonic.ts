// Warden sonic boom. Charged for 3s when locked on a target, then emits a
// long-range line attack that deals 30 HP through armor (ignores shields)
// in a 5-wide beam up to 20 blocks.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SonicBoomState {
  chargingSec: number;
  cooldownSec: number;
  armed: boolean;
}

export function makeSonicBoom(): SonicBoomState {
  return { chargingSec: 0, cooldownSec: 0, armed: false };
}

const CHARGE_DURATION = 3;
const COOLDOWN_SEC = 7;

export interface SonicContext {
  hasTarget: boolean;
  lineOfSight: boolean;
  dtSec: number;
}

export interface SonicResult {
  fired: boolean;
  charging: boolean;
}

export function tickSonic(state: SonicBoomState, ctx: SonicContext): SonicResult {
  state.cooldownSec = Math.max(0, state.cooldownSec - ctx.dtSec);
  if (state.cooldownSec > 0) return { fired: false, charging: false };
  if (!ctx.hasTarget || !ctx.lineOfSight) {
    state.chargingSec = 0;
    return { fired: false, charging: false };
  }
  state.chargingSec += ctx.dtSec;
  if (state.chargingSec < CHARGE_DURATION) {
    return { fired: false, charging: true };
  }
  state.chargingSec = 0;
  state.cooldownSec = COOLDOWN_SEC;
  return { fired: true, charging: false };
}

export const SONIC_BOOM_DAMAGE = 30;
export const SONIC_BOOM_RANGE = 20;
export const SONIC_BOOM_WIDTH = 2; // half-width of beam

// Returns the list of entity ids inside the beam cone.
export function entitiesInBeam(
  origin: Vec3,
  direction: Vec3,
  entities: readonly { id: number; position: Vec3 }[],
): number[] {
  const hit: number[] = [];
  for (const e of entities) {
    const dx = e.position.x - origin.x;
    const dy = e.position.y - origin.y;
    const dz = e.position.z - origin.z;
    const along = dx * direction.x + dy * direction.y + dz * direction.z;
    if (along <= 0 || along > SONIC_BOOM_RANGE) continue;
    const projX = direction.x * along;
    const projY = direction.y * along;
    const projZ = direction.z * along;
    const lateralSq =
      (dx - projX) * (dx - projX) + (dy - projY) * (dy - projY) + (dz - projZ) * (dz - projZ);
    if (lateralSq <= SONIC_BOOM_WIDTH * SONIC_BOOM_WIDTH) hit.push(e.id);
  }
  return hit;
}
