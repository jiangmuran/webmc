// 3D positional sound falloff. MC-style: volume decays linearly with
// distance, clamped between 0 and 1. Occluded sounds (through solid) are
// attenuated further.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SoundQuery {
  sourcePos: Vec3;
  listenerPos: Vec3;
  maxRangeBlocks: number;
  isOccluded: boolean;
  baseVolume: number;
}

export interface SoundMix {
  volume: number;
  distance: number;
}

export function mixSound(q: SoundQuery): SoundMix {
  const dx = q.sourcePos.x - q.listenerPos.x;
  const dy = q.sourcePos.y - q.listenerPos.y;
  const dz = q.sourcePos.z - q.listenerPos.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist >= q.maxRangeBlocks) return { volume: 0, distance: dist };
  let volume = q.baseVolume * (1 - dist / q.maxRangeBlocks);
  if (q.isOccluded) volume *= 0.4;
  return { volume: Math.max(0, Math.min(1, volume)), distance: dist };
}

// Panning: -1 = hard left, 0 = center, 1 = hard right. Based on
// right-hand side of listener forward vector.
export function panSound(listenerPos: Vec3, listenerForward: Vec3, sourcePos: Vec3): number {
  const dx = sourcePos.x - listenerPos.x;
  const dz = sourcePos.z - listenerPos.z;
  const mag = Math.hypot(dx, dz) || 1;
  const rightX = -listenerForward.z;
  const rightZ = listenerForward.x;
  return (dx / mag) * rightX + (dz / mag) * rightZ;
}
