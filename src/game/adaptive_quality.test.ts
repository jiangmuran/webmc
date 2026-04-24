import { describe, it, expect } from 'vitest';
import {
  adjust,
  severeThermalThrottle,
  MIN_VIEW_DISTANCE,
  type QualityState,
} from './adaptive_quality';

const base: QualityState = {
  viewDistance: 8,
  smoothLighting: true,
  particleDensity: 1,
  targetFps: 60,
};

describe('adaptive quality', () => {
  it('low fps drops VD', () => {
    expect(adjust(base, 20).viewDistance).toBe(7);
  });

  it('low fps disables smooth lighting', () => {
    expect(adjust(base, 20).smoothLighting).toBe(false);
  });

  it('high fps increases VD', () => {
    expect(adjust(base, 70).viewDistance).toBe(9);
  });

  it('target fps holds', () => {
    expect(adjust(base, 60)).toBe(base);
  });

  it('floor on VD', () => {
    expect(adjust({ ...base, viewDistance: MIN_VIEW_DISTANCE }, 5).viewDistance).toBe(
      MIN_VIEW_DISTANCE,
    );
  });

  it('thermal throttle high temp', () => {
    expect(severeThermalThrottle(85)).toBe(true);
    expect(severeThermalThrottle(50)).toBe(false);
  });
});
