import { describe, it, expect } from 'vitest';
import { targetFovFor, update, SPRINT_FOV_MULT } from './sprint_fov_boost';

describe('sprint fov boost', () => {
  it('idle = base', () => {
    expect(targetFovFor({ baseFov: 75, sprinting: false, speedAmplifier: 0 })).toBe(75);
  });

  it('sprint boosts 15%', () => {
    expect(targetFovFor({ baseFov: 75, sprinting: true, speedAmplifier: 0 })).toBeCloseTo(
      75 * SPRINT_FOV_MULT,
    );
  });

  it('speed amplifier adds', () => {
    const a = targetFovFor({ baseFov: 75, sprinting: false, speedAmplifier: 2 });
    expect(a).toBeGreaterThan(75);
  });

  it('update lerps', () => {
    let s = { baseFov: 75, targetFov: 75, currentFov: 75 };
    s = update(s, { sprinting: true, speedAmplifier: 0 });
    expect(s.currentFov).toBeGreaterThan(75);
    expect(s.currentFov).toBeLessThan(s.targetFov);
  });

  it('converges over time', () => {
    let s = { baseFov: 75, targetFov: 75, currentFov: 75 };
    for (let i = 0; i < 200; i++) s = update(s, { sprinting: true, speedAmplifier: 0 });
    expect(s.currentFov).toBeCloseTo(s.targetFov);
  });
});
