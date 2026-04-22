import { describe, it, expect } from 'vitest';
import { makeThermal, evaluate, SUSTAIN_MS, TIER_FLOOR } from './thermal_adaptive_mobile';

describe('thermal adaptive', () => {
  it('drops after sustained high frame', () => {
    const s = makeThermal(2);
    let dropped = false;
    for (let t = 0; t <= SUSTAIN_MS + 100; t += 100) {
      const r = evaluate(s, { nowMs: t, lastFrameMs: 50, batteryWarning: false });
      if (r === 'drop') dropped = true;
    }
    expect(dropped).toBe(true);
    expect(s.qualityTier).toBe(1);
  });

  it('battery warning triggers', () => {
    const s = makeThermal(2);
    for (let t = 0; t <= SUSTAIN_MS + 100; t += 100) {
      evaluate(s, { nowMs: t, lastFrameMs: 10, batteryWarning: true });
    }
    expect(s.qualityTier).toBe(1);
  });

  it('raise when cool', () => {
    const s = makeThermal(1);
    for (let t = 0; t < 2000; t += 100) {
      evaluate(s, { nowMs: t, lastFrameMs: 10, batteryWarning: false });
    }
    expect(s.qualityTier).toBeGreaterThan(1);
  });

  it('floor respected', () => {
    const s = makeThermal(TIER_FLOOR);
    for (let t = 0; t <= SUSTAIN_MS + 100; t += 100) {
      evaluate(s, { nowMs: t, lastFrameMs: 100, batteryWarning: true });
    }
    expect(s.qualityTier).toBe(TIER_FLOOR);
  });
});
