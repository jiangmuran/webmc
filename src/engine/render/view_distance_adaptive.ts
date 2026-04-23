export interface AdaptiveState {
  currentRadius: number;
  p95FrameMs: number;
  targetFrameMs: number;
  minRadius: number;
  maxRadius: number;
}

export const HYSTERESIS_HIGH = 1.3;
export const HYSTERESIS_LOW = 0.6;

export function nextRadius(s: AdaptiveState): number {
  if (s.p95FrameMs > s.targetFrameMs * HYSTERESIS_HIGH) {
    return Math.max(s.minRadius, s.currentRadius - 1);
  }
  if (s.p95FrameMs < s.targetFrameMs * HYSTERESIS_LOW) {
    return Math.min(s.maxRadius, s.currentRadius + 1);
  }
  return s.currentRadius;
}
