import { describe, it, expect } from 'vitest';
import { PARTICLES, particleFor } from './particles';

describe('particles', () => {
  it('has all canonical effects', () => {
    for (const k of ['smoke', 'flame', 'bubble', 'crit', 'heart', 'portal'] as const) {
      expect(PARTICLES[k].kind).toBe(k);
    }
  });

  it('bubble floats up (negative gravity)', () => {
    expect(particleFor('bubble').gravity).toBeLessThan(0);
  });

  it('lava drip falls (positive gravity)', () => {
    expect(particleFor('lava_drip').gravity).toBeGreaterThan(0);
  });

  it('every particle has 0-255 color, positive size + lifetime', () => {
    for (const def of Object.values(PARTICLES)) {
      expect(def.sizeMeters).toBeGreaterThan(0);
      expect(def.lifetimeSec).toBeGreaterThan(0);
      for (const c of def.color) {
        expect(c).toBeGreaterThanOrEqual(0);
        expect(c).toBeLessThanOrEqual(255);
      }
    }
  });
});
