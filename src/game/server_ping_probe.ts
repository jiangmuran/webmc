// Server ping probe. Sends a ping, records round-trip time. Tracks
// rolling average + packet loss estimate.

export interface PingTracker {
  sent: number;
  received: number;
  rttSamples: number[];
  maxSamples: number;
}

export function makePingTracker(maxSamples = 30): PingTracker {
  return { sent: 0, received: 0, rttSamples: [], maxSamples };
}

export function onSent(p: PingTracker): void {
  p.sent += 1;
}

export function onReceived(p: PingTracker, rttMs: number): void {
  p.received += 1;
  p.rttSamples.push(rttMs);
  if (p.rttSamples.length > p.maxSamples) p.rttSamples.shift();
}

export function avgRtt(p: PingTracker): number {
  if (p.rttSamples.length === 0) return 0;
  return p.rttSamples.reduce((a, b) => a + b, 0) / p.rttSamples.length;
}

export function packetLossFraction(p: PingTracker): number {
  if (p.sent === 0) return 0;
  return Math.max(0, Math.min(1, 1 - p.received / p.sent));
}

// Health bar-like classification.
export type ConnectionHealth = 'excellent' | 'good' | 'fair' | 'poor' | 'unusable';

export function classifyConnection(p: PingTracker): ConnectionHealth {
  const avg = avgRtt(p);
  const loss = packetLossFraction(p);
  if (loss > 0.2 || avg > 500) return 'unusable';
  if (loss > 0.05 || avg > 250) return 'poor';
  if (loss > 0.02 || avg > 150) return 'fair';
  if (avg > 80) return 'good';
  return 'excellent';
}
