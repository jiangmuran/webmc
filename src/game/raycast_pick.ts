// Crosshair raycast pick. Returns the first block or entity hit when
// walking along a ray from the player's eye. Used to drive mining +
// entity attack + interaction.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type PickResult =
  | { kind: 'block'; pos: Vec3; face: 'up' | 'down' | 'north' | 'south' | 'east' | 'west' }
  | { kind: 'entity'; id: number; hitPos: Vec3 }
  | { kind: 'none' };

export interface RaycastQuery {
  origin: Vec3;
  direction: Vec3;
  maxDistance: number;
  isSolid: (x: number, y: number, z: number) => boolean;
  entityHit: (pos: Vec3) => { id: number; pos: Vec3 } | null;
}

const STEP = 0.05;

export function raycastPick(q: RaycastQuery): PickResult {
  const len = Math.hypot(q.direction.x, q.direction.y, q.direction.z) || 1;
  const dir = { x: q.direction.x / len, y: q.direction.y / len, z: q.direction.z / len };
  let prev = { x: q.origin.x, y: q.origin.y, z: q.origin.z };
  for (let travelled = 0; travelled <= q.maxDistance; travelled += STEP) {
    const here = {
      x: q.origin.x + dir.x * travelled,
      y: q.origin.y + dir.y * travelled,
      z: q.origin.z + dir.z * travelled,
    };
    const entity = q.entityHit(here);
    if (entity) return { kind: 'entity', id: entity.id, hitPos: entity.pos };
    const bx = Math.floor(here.x);
    const by = Math.floor(here.y);
    const bz = Math.floor(here.z);
    if (q.isSolid(bx, by, bz)) {
      const face = pickFace(prev, here, bx, by, bz);
      return { kind: 'block', pos: { x: bx, y: by, z: bz }, face };
    }
    prev = here;
  }
  return { kind: 'none' };
}

function pickFace(
  prev: Vec3,
  here: Vec3,
  bx: number,
  by: number,
  bz: number,
): 'up' | 'down' | 'north' | 'south' | 'east' | 'west' {
  const prevBx = Math.floor(prev.x);
  const prevBy = Math.floor(prev.y);
  const prevBz = Math.floor(prev.z);
  if (prevBx !== bx) return prevBx < bx ? 'west' : 'east';
  if (prevBy !== by) return prevBy < by ? 'down' : 'up';
  if (prevBz !== bz) return prevBz < bz ? 'north' : 'south';
  // Fallback: pick the dominant direction.
  const dx = here.x - prev.x;
  const dy = here.y - prev.y;
  const dz = here.z - prev.z;
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  const az = Math.abs(dz);
  if (ay >= ax && ay >= az) return dy >= 0 ? 'down' : 'up';
  if (ax >= az) return dx >= 0 ? 'west' : 'east';
  return dz >= 0 ? 'north' : 'south';
}
