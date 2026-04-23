import { describe, it, expect } from 'vitest';
import {
  grantsWaterBreathing,
  grantsHaste,
  grantsNightVision,
  POWER_RANGE,
} from './conduit_drown_prevention';

describe('conduit drown prevention', () => {
  const active = { powerActive: true, distance: 20, inWaterOrRain: true };

  it('in range + wet = breathing', () => {
    expect(grantsWaterBreathing(active)).toBe(true);
  });

  it('dry no effect', () => {
    expect(grantsWaterBreathing({ ...active, inWaterOrRain: false })).toBe(false);
  });

  it('out of range no effect', () => {
    expect(grantsWaterBreathing({ ...active, distance: POWER_RANGE + 10 })).toBe(false);
  });

  it('haste + night vision', () => {
    expect(grantsHaste(active)).toBe(true);
    expect(grantsNightVision(active)).toBe(true);
  });
});
