// Third-person camera offset + occlusion pullback. Ray from head to
// desired offset; shorten if occluded.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type CameraView = 'first' | 'third_back' | 'third_front';

export const THIRD_PERSON_DISTANCE = 4;

export function desiredOffset(view: CameraView, yawRad: number, pitchRad: number): Vec3 {
  if (view === 'first') return { x: 0, y: 0, z: 0 };
  const dir = view === 'third_back' ? 1 : -1;
  return {
    x: -Math.sin(yawRad) * Math.cos(pitchRad) * THIRD_PERSON_DISTANCE * dir,
    y: Math.sin(pitchRad) * THIRD_PERSON_DISTANCE * dir,
    z: Math.cos(yawRad) * Math.cos(pitchRad) * THIRD_PERSON_DISTANCE * dir,
  };
}

export function pullbackOnHit(desired: Vec3, hitDistance: number, maxPad = 0.3): Vec3 {
  const len = Math.hypot(desired.x, desired.y, desired.z) || 1;
  const clamped = Math.max(0, hitDistance - maxPad);
  const scale = clamped / len;
  return { x: desired.x * scale, y: desired.y * scale, z: desired.z * scale };
}
