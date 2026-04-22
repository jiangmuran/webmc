// Connection-quality indicator. Uses the ping_rtt monitor plus packet-
// loss % to pick a bar count 1..5 (like a phone signal icon) and a color.

export interface ConnectionStats {
  smoothedRttMs: number;
  p95RttMs: number;
  packetLossFraction: number; // 0..1
}

export type SignalBars = 0 | 1 | 2 | 3 | 4 | 5;

export interface SignalDisplay {
  bars: SignalBars;
  color: string; // CSS-style color name
  label: string;
}

export function signalFor(stats: ConnectionStats): SignalDisplay {
  if (stats.smoothedRttMs <= 0) return { bars: 0, color: 'gray', label: 'offline' };
  const rtt = stats.smoothedRttMs;
  const loss = stats.packetLossFraction;
  if (rtt < 60 && loss < 0.005) return { bars: 5, color: 'lime', label: 'excellent' };
  if (rtt < 120 && loss < 0.01) return { bars: 4, color: 'green', label: 'good' };
  if (rtt < 250 && loss < 0.03) return { bars: 3, color: 'yellow', label: 'ok' };
  if (rtt < 500 && loss < 0.1) return { bars: 2, color: 'orange', label: 'poor' };
  return { bars: 1, color: 'red', label: 'bad' };
}

// Latency mitigation: client-side prediction error threshold in ticks.
// If p95 RTT is over 200 ms, the client runs ahead 2 extra ticks.
export function predictionHorizonTicks(stats: ConnectionStats): number {
  if (stats.p95RttMs < 80) return 1;
  if (stats.p95RttMs < 200) return 2;
  if (stats.p95RttMs < 400) return 4;
  return 6;
}
