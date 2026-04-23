import { describe, it, expect } from 'vitest';
import { canRide, speedMult, startBoost, MAX_BOOST_TICKS } from './pig_saddle_ride';

describe('pig saddle ride', () => {
  it('needs saddle', () => {
    expect(canRide({ saddled: true, holdingCarrotOnStick: false, boostTicks: 0 })).toBe(true);
    expect(canRide({ saddled: false, holdingCarrotOnStick: false, boostTicks: 0 })).toBe(false);
  });

  it('boost faster', () => {
    expect(speedMult({ saddled: true, holdingCarrotOnStick: false, boostTicks: 50 })).toBeGreaterThan(1);
  });

  it('unsaddled speed 1', () => {
    expect(speedMult({ saddled: false, holdingCarrotOnStick: false, boostTicks: 0 })).toBe(1);
  });

  it('boost only with stick', () => {
    expect(startBoost({ saddled: true, holdingCarrotOnStick: true, boostTicks: 0 }).boostTicks).toBe(
      MAX_BOOST_TICKS,
    );
    expect(startBoost({ saddled: true, holdingCarrotOnStick: false, boostTicks: 0 }).boostTicks).toBe(
      0,
    );
  });
});
