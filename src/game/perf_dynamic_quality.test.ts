import { describe, it, expect } from 'vitest';
import {
  current,
  updateQuality,
  QUALITY_LEVELS,
  BREACH_SUSTAIN_MS,
  RECOVERY_SUSTAIN_MS,
} from './perf_dynamic_quality';

describe('dynamic quality', () => {
  it('current accessor', () => {
    expect(current({ currentIndex: 0, breachStartMs: null, recoveryStartMs: null }).name).toBe(
      'low',
    );
  });

  it('sustained breach downgrades', () => {
    const s = {
      currentIndex: 2,
      breachStartMs: null as number | null,
      recoveryStartMs: null as number | null,
    };
    const t = QUALITY_LEVELS[2]?.targetFrameMs ?? 16;
    updateQuality(s, { p95FrameMs: t * 2, nowMs: 0 });
    const r = updateQuality(s, { p95FrameMs: t * 2, nowMs: BREACH_SUSTAIN_MS + 1 });
    expect(r).toBe('downgrade');
    expect(s.currentIndex).toBe(1);
  });

  it('recovery upgrades', () => {
    const s = {
      currentIndex: 0,
      breachStartMs: null as number | null,
      recoveryStartMs: null as number | null,
    };
    const t = QUALITY_LEVELS[0]?.targetFrameMs ?? 33;
    updateQuality(s, { p95FrameMs: t * 0.3, nowMs: 0 });
    const r = updateQuality(s, { p95FrameMs: t * 0.3, nowMs: RECOVERY_SUSTAIN_MS + 1 });
    expect(r).toBe('upgrade');
  });

  it('stable = none', () => {
    const s = {
      currentIndex: 1,
      breachStartMs: null as number | null,
      recoveryStartMs: null as number | null,
    };
    const t = QUALITY_LEVELS[1]?.targetFrameMs ?? 20;
    expect(updateQuality(s, { p95FrameMs: t, nowMs: 0 })).toBe('none');
  });
});
