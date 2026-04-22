// Thermal-adaptive rendering on mobile. Detect sustained high frame
// time + battery temperature warning → drop quality tier.

export interface ThermalState {
  sustainedHighMs: number;
  lastReportMs: number;
  qualityTier: number; // 0 = minimum, 3 = full
}

export const HIGH_FRAME_THRESHOLD_MS = 33;
export const SUSTAIN_MS = 5000;
export const TIER_FLOOR = 0;
export const TIER_CEILING = 3;

export function makeThermal(startTier = 2): ThermalState {
  return { sustainedHighMs: 0, lastReportMs: 0, qualityTier: startTier };
}

export interface TickQuery {
  nowMs: number;
  lastFrameMs: number;
  batteryWarning: boolean;
}

export type Action = 'drop' | 'raise' | 'hold';

export function evaluate(s: ThermalState, q: TickQuery): Action {
  const dt = q.nowMs - s.lastReportMs;
  s.lastReportMs = q.nowMs;
  if (q.lastFrameMs > HIGH_FRAME_THRESHOLD_MS || q.batteryWarning) {
    s.sustainedHighMs += dt;
    if (s.sustainedHighMs >= SUSTAIN_MS && s.qualityTier > TIER_FLOOR) {
      s.qualityTier -= 1;
      s.sustainedHighMs = 0;
      return 'drop';
    }
    return 'hold';
  }
  s.sustainedHighMs = Math.max(0, s.sustainedHighMs - dt);
  if (
    s.sustainedHighMs === 0 &&
    q.lastFrameMs < HIGH_FRAME_THRESHOLD_MS * 0.6 &&
    s.qualityTier < TIER_CEILING
  ) {
    s.qualityTier += 1;
    return 'raise';
  }
  return 'hold';
}
