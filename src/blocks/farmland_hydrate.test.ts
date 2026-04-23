import { describe, it, expect } from 'vitest';
import { hydrated, tick, tramplesToDirt, HYDRATION_RADIUS } from './farmland_hydrate';

describe('farmland hydrate', () => {
  it('dry not hydrated', () => {
    expect(hydrated({ hasWaterNearby: false, raining: false, moistureLevel: 0 })).toBe(false);
  });

  it('moisture ≥1 hydrated', () => {
    expect(hydrated({ hasWaterNearby: false, raining: false, moistureLevel: 3 })).toBe(true);
  });

  it('water nearby soaks to 7', () => {
    const r = tick({ hasWaterNearby: true, raining: false, moistureLevel: 0 });
    expect(r.moistureLevel).toBe(7);
  });

  it('no water drops', () => {
    const r = tick({ hasWaterNearby: false, raining: false, moistureLevel: 5 });
    expect(r.moistureLevel).toBe(4);
  });

  it('trample at jump height', () => {
    expect(tramplesToDirt(1)).toBe(true);
    expect(tramplesToDirt(0)).toBe(false);
  });

  it('hydration radius 4', () => {
    expect(HYDRATION_RADIUS).toBe(4);
  });
});
