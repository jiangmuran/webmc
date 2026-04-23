import { describe, it, expect } from 'vitest';
import { nextMoisture, reverts, growthRateMult, MAX_MOISTURE } from './farmland_hydration_moisture';

describe('farmland hydration', () => {
  it('water nearby maxes moisture', () => {
    expect(
      nextMoisture({ moisture: 0, hasWaterWithin4: true, isRaining: false, topBlockIsAir: true }),
    ).toBe(MAX_MOISTURE);
  });

  it('dry decrements', () => {
    expect(
      nextMoisture({ moisture: 3, hasWaterWithin4: false, isRaining: false, topBlockIsAir: true }),
    ).toBe(2);
  });

  it('rain hydrates', () => {
    expect(
      nextMoisture({ moisture: 0, hasWaterWithin4: false, isRaining: true, topBlockIsAir: true }),
    ).toBe(MAX_MOISTURE);
  });

  it('reverts with block above', () => {
    expect(
      reverts({ moisture: 5, hasWaterWithin4: true, isRaining: false, topBlockIsAir: false }),
    ).toBe(true);
  });

  it('wet grows faster', () => {
    expect(
      growthRateMult({ moisture: MAX_MOISTURE, hasWaterWithin4: true, isRaining: false, topBlockIsAir: true }),
    ).toBeGreaterThan(
      growthRateMult({ moisture: 0, hasWaterWithin4: false, isRaining: false, topBlockIsAir: true }),
    );
  });
});
