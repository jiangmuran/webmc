// Doppler shift for moving sound sources. Simple relative-velocity model
// projected onto listener→source axis.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface DopplerCtx {
  listenerPos: Vec3;
  listenerVel: Vec3;
  sourcePos: Vec3;
  sourceVel: Vec3;
  speedOfSound: number;
}

export const DEFAULT_SPEED_OF_SOUND = 343; // m/s

export function pitchMultiplier(c: DopplerCtx): number {
  const dx = c.sourcePos.x - c.listenerPos.x;
  const dy = c.sourcePos.y - c.listenerPos.y;
  const dz = c.sourcePos.z - c.listenerPos.z;
  const len = Math.hypot(dx, dy, dz) || 1;
  const nx = dx / len;
  const ny = dy / len;
  const nz = dz / len;
  const listenerProjected = c.listenerVel.x * nx + c.listenerVel.y * ny + c.listenerVel.z * nz;
  const sourceProjected = c.sourceVel.x * nx + c.sourceVel.y * ny + c.sourceVel.z * nz;
  const c0 = c.speedOfSound;
  return (c0 + listenerProjected) / (c0 + sourceProjected);
}

export function attenuation(distance: number, refDistance = 1, rolloffFactor = 1): number {
  if (distance <= refDistance) return 1;
  return refDistance / (refDistance + rolloffFactor * (distance - refDistance));
}
