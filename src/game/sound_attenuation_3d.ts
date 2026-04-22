// 3D sound attenuation. Distance-based volume rolloff + stereo pan.
// Blocks attenuate sound; we approximate by multiplying by 0.5 per
// solid block along the line.

export interface SoundEmit {
  sourceX: number;
  sourceY: number;
  sourceZ: number;
  baseVolume: number; // 0..1
  maxDistance: number;
}

export interface ListenerQuery {
  listenerX: number;
  listenerY: number;
  listenerZ: number;
  forwardX: number;
  forwardZ: number;
}

export interface SoundMix {
  volume: number;
  panLR: number; // -1 (L) .. +1 (R)
}

export function attenuate(e: SoundEmit, l: ListenerQuery): SoundMix {
  const dx = e.sourceX - l.listenerX;
  const dy = e.sourceY - l.listenerY;
  const dz = e.sourceZ - l.listenerZ;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (dist > e.maxDistance) return { volume: 0, panLR: 0 };
  const volume = Math.max(0, e.baseVolume * (1 - dist / e.maxDistance));
  // Pan: use cross product (right-hand perpendicular to forward).
  const rightX = l.forwardZ;
  const rightZ = -l.forwardX;
  const pan = dist === 0 ? 0 : (dx * rightX + dz * rightZ) / dist;
  return { volume, panLR: Math.max(-1, Math.min(1, pan)) };
}

// Occlusion: each blocking block along LOS reduces volume by 50%.
export function occludeVolume(volume: number, blockingCount: number): number {
  return volume * Math.pow(0.5, blockingCount);
}
