export interface Snapshot {
  t: number;
  x: number;
  y: number;
  z: number;
  yaw: number;
}

export const INTERP_DELAY_MS = 100;

export function renderPos(buffer: readonly Snapshot[], nowMs: number): Snapshot | undefined {
  if (buffer.length === 0) return undefined;
  const target = nowMs - INTERP_DELAY_MS;
  let prev: Snapshot | undefined;
  let next: Snapshot | undefined;
  for (const s of buffer) {
    if (s.t <= target) prev = s;
    else if (next === undefined) {
      next = s;
      break;
    }
  }
  if (prev === undefined) return buffer[0];
  if (next === undefined) return prev;
  const span = next.t - prev.t;
  if (span <= 0) return prev;
  const f = (target - prev.t) / span;
  return {
    t: target,
    x: prev.x + (next.x - prev.x) * f,
    y: prev.y + (next.y - prev.y) * f,
    z: prev.z + (next.z - prev.z) * f,
    yaw: prev.yaw + (next.yaw - prev.yaw) * f,
  };
}

export function pruneOld(buffer: readonly Snapshot[], nowMs: number): readonly Snapshot[] {
  const keepAfter = nowMs - INTERP_DELAY_MS * 5;
  return buffer.filter((s) => s.t >= keepAfter);
}
