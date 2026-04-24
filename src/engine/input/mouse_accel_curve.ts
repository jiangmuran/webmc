export interface MouseInput {
  dxPx: number;
  dyPx: number;
  dtMs: number;
  baseSensitivity: number;
  accelerationEnabled: boolean;
}

export function appliedLook(i: MouseInput): { yaw: number; pitch: number } {
  const speed = Math.hypot(i.dxPx, i.dyPx) / Math.max(1, i.dtMs);
  const accel = i.accelerationEnabled ? 1 + Math.min(2, speed * 0.01) : 1;
  const factor = i.baseSensitivity * accel;
  return {
    yaw: i.dxPx * factor,
    pitch: i.dyPx * factor,
  };
}

export const PITCH_CLAMP = Math.PI / 2 - 0.001;

export function clampPitch(pitch: number): number {
  return Math.max(-PITCH_CLAMP, Math.min(PITCH_CLAMP, pitch));
}
