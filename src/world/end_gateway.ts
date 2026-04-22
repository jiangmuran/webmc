// End gateway. A small portal that appears after defeating the ender
// dragon; throwing an ender pearl through it teleports the player 1024
// blocks away (into the outer islands).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface EndGateway {
  position: Vec3;
  targetPosition: Vec3;
  exitPortal: boolean; // true = inner → outer, false = outer → inner
}

const OUTER_DISTANCE = 1024;

export function makeGateway(position: Vec3, angle: number): EndGateway {
  const target = {
    x: position.x + Math.cos(angle) * OUTER_DISTANCE,
    y: position.y,
    z: position.z + Math.sin(angle) * OUTER_DISTANCE,
  };
  return { position: { ...position }, targetPosition: target, exitPortal: true };
}

// Thrown pearl passes through gateway → teleport to the target position.
export interface PearlQuery {
  pearlPos: Vec3;
  gateway: EndGateway;
}

export function pearlTeleport(q: PearlQuery): Vec3 | null {
  const dx = q.pearlPos.x - q.gateway.position.x;
  const dy = q.pearlPos.y - q.gateway.position.y;
  const dz = q.pearlPos.z - q.gateway.position.z;
  if (Math.abs(dx) > 1 || Math.abs(dy) > 2 || Math.abs(dz) > 1) return null;
  return { ...q.gateway.targetPosition };
}
