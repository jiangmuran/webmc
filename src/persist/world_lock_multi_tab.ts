export interface LockRecord {
  worldId: string;
  tabId: string;
  heartbeatMs: number;
}

export const HEARTBEAT_TIMEOUT_MS = 5000;

export function acquire(
  record: LockRecord | undefined,
  requester: string,
  nowMs: number,
): LockRecord | undefined {
  if (record === undefined) {
    return { worldId: '', tabId: requester, heartbeatMs: nowMs };
  }
  if (record.tabId === requester) return { ...record, heartbeatMs: nowMs };
  if (nowMs - record.heartbeatMs >= HEARTBEAT_TIMEOUT_MS) {
    return { ...record, tabId: requester, heartbeatMs: nowMs };
  }
  return undefined;
}

export function refresh(record: LockRecord, nowMs: number): LockRecord {
  return { ...record, heartbeatMs: nowMs };
}
