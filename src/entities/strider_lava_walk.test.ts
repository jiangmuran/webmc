import { describe, it, expect } from 'vitest';
import {
  currentSpeed,
  damagedOutsideLava,
  canSteer,
  immuneToLava,
  STRIDER_LAVA_SPEED,
  STRIDER_LAND_SPEED,
} from './strider_lava_walk';

describe('strider lava walk', () => {
  it('faster in lava', () => {
    expect(currentSpeed({ inLava: true, inRain: false, saddled: false, rider: null })).toBe(
      STRIDER_LAVA_SPEED,
    );
  });

  it('slower on land', () => {
    expect(currentSpeed({ inLava: false, inRain: false, saddled: false, rider: null })).toBe(
      STRIDER_LAND_SPEED,
    );
  });

  it('shiver in rain', () => {
    expect(currentSpeed({ inLava: false, inRain: true, saddled: false, rider: null })).toBeLessThan(
      STRIDER_LAND_SPEED,
    );
  });

  it('steer needs saddle + rider', () => {
    expect(canSteer({ inLava: true, inRain: false, saddled: true, rider: 'p1' })).toBe(true);
    expect(canSteer({ inLava: true, inRain: false, saddled: false, rider: 'p1' })).toBe(false);
    expect(canSteer({ inLava: true, inRain: false, saddled: true, rider: null })).toBe(false);
  });

  it('immune to lava', () => {
    expect(immuneToLava()).toBe(true);
    expect(damagedOutsideLava({ inLava: false, inRain: false, saddled: false, rider: null })).toBe(
      false,
    );
  });
});
