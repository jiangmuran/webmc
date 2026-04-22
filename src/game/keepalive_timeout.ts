// Keepalive / timeout. Server pings every 15s; client has 30s to reply
// before disconnection (timeout). Ping/latency measured from round-trip.

export const KEEPALIVE_INTERVAL_MS = 15000;
export const KEEPALIVE_TIMEOUT_MS = 30000;

export interface KeepaliveState {
  lastSentMs: number;
  lastAckedMs: number;
  latencyMs: number;
}

export function shouldSendPing(s: KeepaliveState, nowMs: number): boolean {
  return nowMs - s.lastSentMs >= KEEPALIVE_INTERVAL_MS;
}

export function isTimedOut(s: KeepaliveState, nowMs: number): boolean {
  return nowMs - s.lastAckedMs >= KEEPALIVE_TIMEOUT_MS;
}

export function onAck(s: KeepaliveState, nowMs: number, pingSentAtMs: number): KeepaliveState {
  return { ...s, lastAckedMs: nowMs, latencyMs: nowMs - pingSentAtMs };
}

export function latencyBucket(ms: number): 'excellent' | 'good' | 'poor' | 'bad' {
  if (ms < 80) return 'excellent';
  if (ms < 150) return 'good';
  if (ms < 300) return 'poor';
  return 'bad';
}
