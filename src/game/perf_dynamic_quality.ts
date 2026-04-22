// Dynamic quality downgrade. Per p95 frame time, walk quality level
// down when sustained high; allow upgrade back when cool.

export interface QualityLevel {
  name: 'low' | 'med' | 'high' | 'ultra';
  renderDistance: number;
  shadows: boolean;
  smoothLighting: boolean;
  particleLevel: 'minimal' | 'decreased' | 'all';
  targetFrameMs: number;
}

export const QUALITY_LEVELS: QualityLevel[] = [
  {
    name: 'low',
    renderDistance: 4,
    shadows: false,
    smoothLighting: false,
    particleLevel: 'minimal',
    targetFrameMs: 33,
  },
  {
    name: 'med',
    renderDistance: 8,
    shadows: false,
    smoothLighting: true,
    particleLevel: 'decreased',
    targetFrameMs: 20,
  },
  {
    name: 'high',
    renderDistance: 12,
    shadows: true,
    smoothLighting: true,
    particleLevel: 'all',
    targetFrameMs: 16,
  },
  {
    name: 'ultra',
    renderDistance: 16,
    shadows: true,
    smoothLighting: true,
    particleLevel: 'all',
    targetFrameMs: 12,
  },
];

export interface QualityState {
  currentIndex: number; // 0..QUALITY_LEVELS.length-1
  breachStartMs: number | null;
  recoveryStartMs: number | null;
}

export const BREACH_SUSTAIN_MS = 3000;
export const RECOVERY_SUSTAIN_MS = 10_000;

export function current(s: QualityState): QualityLevel {
  const l = QUALITY_LEVELS[s.currentIndex] ?? QUALITY_LEVELS[0];
  if (!l) throw new Error('no quality levels');
  return l;
}

export interface TickQuery {
  p95FrameMs: number;
  nowMs: number;
}

export type Transition = 'none' | 'downgrade' | 'upgrade';

export function updateQuality(s: QualityState, q: TickQuery): Transition {
  const target = current(s).targetFrameMs;
  const breach = q.p95FrameMs > target * 1.5;
  const cool = q.p95FrameMs < target * 0.7;

  if (breach) {
    s.recoveryStartMs = null;
    s.breachStartMs ??= q.nowMs;
    if (q.nowMs - s.breachStartMs >= BREACH_SUSTAIN_MS && s.currentIndex > 0) {
      s.currentIndex -= 1;
      s.breachStartMs = null;
      return 'downgrade';
    }
    return 'none';
  }
  if (cool) {
    s.breachStartMs = null;
    s.recoveryStartMs ??= q.nowMs;
    if (
      q.nowMs - s.recoveryStartMs >= RECOVERY_SUSTAIN_MS &&
      s.currentIndex < QUALITY_LEVELS.length - 1
    ) {
      s.currentIndex += 1;
      s.recoveryStartMs = null;
      return 'upgrade';
    }
    return 'none';
  }
  s.breachStartMs = null;
  s.recoveryStartMs = null;
  return 'none';
}
