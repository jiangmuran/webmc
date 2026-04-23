export interface ThrottleInput {
  lastSnapshotMs: number;
  pendingBytes: number;
  nowMs: number;
}

export const BASE_INTERVAL_MS = 1000;
export const MIN_BYTES_TO_FORCE = 4 * 1024 * 1024;

export function shouldSnapshot(i: ThrottleInput): boolean {
  if (i.pendingBytes >= MIN_BYTES_TO_FORCE) return true;
  if (i.pendingBytes === 0) return false;
  return i.nowMs - i.lastSnapshotMs >= BASE_INTERVAL_MS;
}

export function expectedNextSnapshotMs(lastMs: number, backlogBytes: number): number {
  const scale = 1 + Math.min(4, backlogBytes / (MIN_BYTES_TO_FORCE / 4));
  return lastMs + BASE_INTERVAL_MS / scale;
}
