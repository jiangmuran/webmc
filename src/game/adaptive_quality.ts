export interface QualityState {
  viewDistance: number;
  smoothLighting: boolean;
  particleDensity: number;
  targetFps: number;
}

export const MIN_VIEW_DISTANCE = 2;
export const MAX_VIEW_DISTANCE = 24;

export function adjust(s: QualityState, recentFps: number): QualityState {
  if (recentFps < s.targetFps * 0.7) {
    return {
      ...s,
      viewDistance: Math.max(MIN_VIEW_DISTANCE, s.viewDistance - 1),
      smoothLighting: false,
      particleDensity: Math.max(0.25, s.particleDensity * 0.75),
    };
  }
  if (recentFps > s.targetFps * 1.1) {
    return {
      ...s,
      viewDistance: Math.min(MAX_VIEW_DISTANCE, s.viewDistance + 1),
      particleDensity: Math.min(1, s.particleDensity * 1.1),
    };
  }
  return s;
}

export function severeThermalThrottle(cpuTempC: number): boolean {
  return cpuTempC >= 80;
}
