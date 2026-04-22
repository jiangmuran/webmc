// Enderman aggro-on-stare. Looking directly at an enderman's head (within
// a ~1° cone) triggers aggression + teleportation. Wearing a pumpkin
// bypasses the stare check. Water, rain, sunlight, and projectile hits
// make endermen teleport away.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface EndermanState {
  id: number;
  position: Vec3;
  headOffsetY: number;
  angry: boolean;
  health: number;
  lastTeleportSec: number;
}

export const ENDERMAN_MAX_HEALTH = 40;
const STARE_ANGLE_COS = Math.cos((Math.PI / 180) * 1);

export function makeEnderman(id: number, at: Vec3): EndermanState {
  return {
    id,
    position: { ...at },
    headOffsetY: 2.55,
    angry: false,
    health: ENDERMAN_MAX_HEALTH,
    lastTeleportSec: 0,
  };
}

export interface PlayerLook {
  eyePos: Vec3;
  look: Vec3; // unit vector
  wearingPumpkin: boolean;
}

// Returns true if the player is staring at the enderman's head.
export function playerIsStaring(state: EndermanState, look: PlayerLook): boolean {
  if (look.wearingPumpkin) return false;
  const headX = state.position.x;
  const headY = state.position.y + state.headOffsetY;
  const headZ = state.position.z;
  const dx = headX - look.eyePos.x;
  const dy = headY - look.eyePos.y;
  const dz = headZ - look.eyePos.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist < 0.1 || dist > 64) return false;
  const ux = dx / dist;
  const uy = dy / dist;
  const uz = dz / dist;
  const dot = ux * look.look.x + uy * look.look.y + uz * look.look.z;
  return dot > STARE_ANGLE_COS;
}

// Environmental triggers that force a teleport.
export interface EnvTriggers {
  inWater: boolean;
  inRain: boolean;
  inSunlight: boolean;
  projectileHit: boolean;
}

export function shouldTeleportEnv(t: EnvTriggers): boolean {
  return t.inWater || t.inRain || t.projectileHit;
}

// In full sunlight, take damage (like skeletons) UNLESS in shade.
export function sunlightDamageIfExposed(inSunlight: boolean): number {
  return inSunlight ? 0 : 0; // MC: endermen do NOT take sunlight damage (distinct from skeletons)
}

// Block-picking: endermen can pick up one of a set of "pickable" blocks
// and carry it around; they drop it on aggro cancel or death.
const PICKABLE = new Set<string>([
  'webmc:grass_block',
  'webmc:dirt',
  'webmc:sand',
  'webmc:gravel',
  'webmc:clay',
  'webmc:flower',
  'webmc:mushroom_red',
  'webmc:mushroom_brown',
  'webmc:tnt',
  'webmc:melon',
  'webmc:pumpkin',
]);

export function isPickable(blockId: string): boolean {
  return PICKABLE.has(blockId);
}
