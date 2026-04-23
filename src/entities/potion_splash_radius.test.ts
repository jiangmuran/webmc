import { describe, it, expect } from 'vitest';
import {
  effectMultiplierAt,
  affectsEntityAt,
  lingerCloudDurationTicks,
  SPLASH_RADIUS,
} from './potion_splash_radius';

describe('potion splash radius', () => {
  it('full at 0', () => {
    expect(effectMultiplierAt(0)).toBe(1);
  });

  it('zero past radius', () => {
    expect(effectMultiplierAt(SPLASH_RADIUS + 1)).toBe(0);
  });

  it('partial in between', () => {
    const m = effectMultiplierAt(SPLASH_RADIUS / 2);
    expect(m).toBeGreaterThan(0);
    expect(m).toBeLessThan(1);
  });

  it('affects within', () => {
    expect(affectsEntityAt(2)).toBe(true);
    expect(affectsEntityAt(10)).toBe(false);
  });

  it('linger scales', () => {
    expect(lingerCloudDurationTicks(2)).toBeGreaterThan(lingerCloudDurationTicks(0));
  });
});
