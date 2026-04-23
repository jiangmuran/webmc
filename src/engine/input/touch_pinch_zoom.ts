export interface PinchState {
  startDistance: number;
  startFov: number;
  currentFov: number;
}

export const MIN_FOV = 30;
export const MAX_FOV = 110;

export function updateFov(s: PinchState, currentDistance: number): PinchState {
  if (s.startDistance <= 0) return s;
  const ratio = currentDistance / s.startDistance;
  const target = s.startFov / ratio;
  return { ...s, currentFov: Math.max(MIN_FOV, Math.min(MAX_FOV, target)) };
}

export function startPinch(fov: number, d: number): PinchState {
  return { startDistance: d, startFov: fov, currentFov: fov };
}
