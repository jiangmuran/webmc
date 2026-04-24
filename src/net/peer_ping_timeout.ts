export const TIMEOUT_MS = 30000;
export const PING_INTERVAL_MS = 10000;

export interface PeerHealth {
  peerId: string;
  lastPingSentMs: number;
  lastPongReceivedMs: number;
  rttMsSamples: readonly number[];
}

export function isTimedOut(p: PeerHealth, nowMs: number): boolean {
  return nowMs - p.lastPongReceivedMs >= TIMEOUT_MS;
}

export function shouldSendPing(p: PeerHealth, nowMs: number): boolean {
  return nowMs - p.lastPingSentMs >= PING_INTERVAL_MS;
}

export function recordPong(p: PeerHealth, nowMs: number): PeerHealth {
  const rtt = nowMs - p.lastPingSentMs;
  return {
    ...p,
    lastPongReceivedMs: nowMs,
    rttMsSamples: [...p.rttMsSamples.slice(-9), rtt],
  };
}

export function averageRtt(p: PeerHealth): number {
  if (p.rttMsSamples.length === 0) return 0;
  return p.rttMsSamples.reduce((s, r) => s + r, 0) / p.rttMsSamples.length;
}
