// Ping / round-trip-time estimator. Clients send a PING with their
// current client-clock; host echoes it back as PONG; client computes RTT
// = now - echoed_client_clock. We maintain a smoothed RTT and track
// max/min and dropped pings.

export interface PingState {
  pendingByNonce: Map<number, number>; // nonce → sentAtSec
  samples: number[]; // last N samples in ms
  maxSamples: number;
  nextNonce: number;
}

export function makePingState(maxSamples = 32): PingState {
  return {
    pendingByNonce: new Map(),
    samples: [],
    maxSamples,
    nextNonce: 1,
  };
}

export function sendPing(state: PingState, nowSec: number): number {
  const nonce = state.nextNonce++;
  state.pendingByNonce.set(nonce, nowSec);
  return nonce;
}

export interface PongResult {
  rttMs: number;
  wasUnknown: boolean;
}

export function onPong(state: PingState, nonce: number, nowSec: number): PongResult {
  const sent = state.pendingByNonce.get(nonce);
  if (sent === undefined) return { rttMs: 0, wasUnknown: true };
  state.pendingByNonce.delete(nonce);
  const rttMs = (nowSec - sent) * 1000;
  state.samples.push(rttMs);
  if (state.samples.length > state.maxSamples) state.samples.shift();
  return { rttMs, wasUnknown: false };
}

export function smoothedRttMs(state: PingState): number {
  if (state.samples.length === 0) return 0;
  const sum = state.samples.reduce((a, b) => a + b, 0);
  return sum / state.samples.length;
}

export function p95RttMs(state: PingState): number {
  if (state.samples.length === 0) return 0;
  const sorted = [...state.samples].sort((a, b) => a - b);
  const idx = Math.floor(sorted.length * 0.95);
  return sorted[Math.min(sorted.length - 1, idx)] ?? 0;
}

// Drop pings that haven't returned after `timeoutSec`.
export function prunePending(state: PingState, nowSec: number, timeoutSec: number): number {
  let dropped = 0;
  for (const [nonce, sent] of state.pendingByNonce) {
    if (nowSec - sent >= timeoutSec) {
      state.pendingByNonce.delete(nonce);
      dropped++;
    }
  }
  return dropped;
}
