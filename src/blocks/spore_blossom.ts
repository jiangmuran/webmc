// Spore blossom: lush caves ceiling flower emitting green particles
// downward within a radius.

export const SPORE_PARTICLE_RADIUS = 10;
export const SPORE_PARTICLE_PER_TICK = 2;

export function emitsParticleAt(
  blossom: { x: number; y: number; z: number },
  pt: { x: number; y: number; z: number },
): boolean {
  if (pt.y > blossom.y) return false;
  if (blossom.y - pt.y > SPORE_PARTICLE_RADIUS) return false;
  const dx = pt.x - blossom.x;
  const dz = pt.z - blossom.z;
  return dx * dx + dz * dz <= SPORE_PARTICLE_RADIUS * SPORE_PARTICLE_RADIUS;
}

export function canAttach(blockAboveIsSolid: boolean): boolean {
  return blockAboveIsSolid;
}

export function breaksIfAnchorLost(): boolean {
  return true;
}
