import { describe, it, expect } from 'vitest';
import {
  moveSpeedMultiplier,
  wouldFallOff,
  canSeeEnderman,
  SNEAK_SPEED_MULT,
} from './sneak_movement';

describe('sneak movement', () => {
  it('normal speed standing', () => {
    expect(
      moveSpeedMultiplier({ sneaking: false, onEdge: false, wearingCarvedPumpkin: false }),
    ).toBe(1);
  });

  it('slows when sneaking', () => {
    expect(
      moveSpeedMultiplier({ sneaking: true, onEdge: false, wearingCarvedPumpkin: false }),
    ).toBe(SNEAK_SPEED_MULT);
  });

  it('sneak on edge stays', () => {
    expect(wouldFallOff({ sneaking: true, onEdge: true, wearingCarvedPumpkin: false })).toBe(false);
  });

  it('walk on edge falls', () => {
    expect(wouldFallOff({ sneaking: false, onEdge: true, wearingCarvedPumpkin: false })).toBe(true);
  });

  it('pumpkin hides from enderman', () => {
    expect(canSeeEnderman({ sneaking: false, onEdge: false, wearingCarvedPumpkin: true })).toBe(
      true,
    );
  });
});
