export interface LagStats {
  rttMs: number;
  jitterMs: number;
  packetLoss: number;
}

export const MIN_INTERP_DELAY = 50;
export const MAX_INTERP_DELAY = 400;

export function recommendedInterpDelay(s: LagStats): number {
  const fromRtt = Math.min(MAX_INTERP_DELAY, s.rttMs / 2 + s.jitterMs * 2);
  return Math.max(MIN_INTERP_DELAY, fromRtt);
}

export function connectionQuality(s: LagStats): 'excellent' | 'good' | 'fair' | 'poor' {
  if (s.packetLoss < 0.005 && s.rttMs < 80) return 'excellent';
  if (s.packetLoss < 0.03 && s.rttMs < 150) return 'good';
  if (s.packetLoss < 0.1 && s.rttMs < 300) return 'fair';
  return 'poor';
}

export function snapshotIntervalForQuality(q: 'excellent' | 'good' | 'fair' | 'poor'): number {
  if (q === 'excellent') return 33;
  if (q === 'good') return 50;
  if (q === 'fair') return 100;
  return 200;
}
