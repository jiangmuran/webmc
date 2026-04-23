export interface ListenerState {
  x: number;
  y: number;
  z: number;
  yaw: number;
}

export interface SoundSource {
  x: number;
  y: number;
  z: number;
}

export function relativePosition(
  l: ListenerState,
  s: SoundSource,
): { dxRight: number; dyUp: number; dzForward: number } {
  const dx = s.x - l.x;
  const dz = s.z - l.z;
  const cos = Math.cos(-l.yaw);
  const sin = Math.sin(-l.yaw);
  return {
    dxRight: dx * cos - dz * sin,
    dyUp: s.y - l.y,
    dzForward: dx * sin + dz * cos,
  };
}

export function stereoPan(dxRight: number, distance: number): number {
  if (distance <= 0) return 0;
  return Math.max(-1, Math.min(1, dxRight / distance));
}
