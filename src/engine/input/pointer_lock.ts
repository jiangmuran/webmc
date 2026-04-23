// Pointer lock abstraction for desktop. Maintains accumulated delta;
// zeros delta on frame consumption. On mobile, pointer lock isn't used.

export interface MouseLookState {
  locked: boolean;
  dx: number;
  dy: number;
  sensitivity: number;
  invertY: boolean;
}

export function initState(): MouseLookState {
  return { locked: false, dx: 0, dy: 0, sensitivity: 0.2, invertY: false };
}

export function onRawDelta(s: MouseLookState, dx: number, dy: number): void {
  if (!s.locked) return;
  s.dx += dx;
  s.dy += dy;
}

export function consume(s: MouseLookState): { yawDelta: number; pitchDelta: number } {
  const yaw = s.dx * s.sensitivity * 0.1;
  const pitch = s.dy * s.sensitivity * 0.1 * (s.invertY ? 1 : -1);
  s.dx = 0;
  s.dy = 0;
  return { yawDelta: yaw, pitchDelta: pitch };
}

export function onLockChange(s: MouseLookState, locked: boolean): void {
  s.locked = locked;
  s.dx = 0;
  s.dy = 0;
}

export function clampPitch(pitch: number): number {
  const max = Math.PI / 2 - 0.001;
  return Math.max(-max, Math.min(max, pitch));
}
