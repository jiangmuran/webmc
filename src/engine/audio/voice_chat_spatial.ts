export interface VoiceSource {
  peerId: string;
  x: number;
  y: number;
  z: number;
  volume: number;
}

export interface Listener {
  x: number;
  y: number;
  z: number;
  yaw: number;
}

export const PROXIMITY_RADIUS = 32;

export function spatialVolume(source: VoiceSource, listener: Listener): number {
  const d = Math.hypot(source.x - listener.x, source.y - listener.y, source.z - listener.z);
  if (d >= PROXIMITY_RADIUS) return 0;
  return source.volume * (1 - d / PROXIMITY_RADIUS);
}

export function stereoPan(source: VoiceSource, listener: Listener): number {
  const dx = source.x - listener.x;
  const dz = source.z - listener.z;
  const local = dx * Math.cos(-listener.yaw) - dz * Math.sin(-listener.yaw);
  const mag = Math.hypot(dx, dz) || 1;
  return Math.max(-1, Math.min(1, local / mag));
}
