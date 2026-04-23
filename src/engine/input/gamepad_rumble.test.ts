import { describe, it, expect } from 'vitest';
import { clampRumble, mergeRumble, rumbleForDamage } from './gamepad_rumble';

describe('gamepad rumble', () => {
  it('clamps intensity', () => {
    expect(clampRumble({ lowIntensity: 5, highIntensity: -1, durationMs: 100 })).toEqual({
      lowIntensity: 1,
      highIntensity: 0,
      durationMs: 100,
    });
  });

  it('clamps duration', () => {
    expect(clampRumble({ lowIntensity: 0, highIntensity: 0, durationMs: 99999 }).durationMs).toBe(
      5000,
    );
  });

  it('merge takes max', () => {
    const m = mergeRumble(
      { lowIntensity: 0.2, highIntensity: 0.5, durationMs: 100 },
      { lowIntensity: 0.8, highIntensity: 0.1, durationMs: 50 },
    );
    expect(m.lowIntensity).toBe(0.8);
    expect(m.highIntensity).toBe(0.5);
    expect(m.durationMs).toBe(100);
  });

  it('damage scales rumble', () => {
    const light = rumbleForDamage(1);
    const heavy = rumbleForDamage(15);
    expect(heavy.highIntensity).toBeGreaterThan(light.highIntensity);
  });
});
