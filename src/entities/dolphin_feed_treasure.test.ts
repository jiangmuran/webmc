import { describe, it, expect } from 'vitest';
import { willLead, swimBoostActive, accepts, LEAD_DISTANCE_MAX } from './dolphin_feed_treasure';

describe('dolphin feed treasure', () => {
  it('leads after fish + in range', () => {
    expect(willLead({ fishesFed: 1, isSwimming: true, nearestStructureDistance: 50 })).toBe(true);
  });

  it('no lead without fish', () => {
    expect(willLead({ fishesFed: 0, isSwimming: true, nearestStructureDistance: 50 })).toBe(false);
  });

  it('no lead out of range', () => {
    expect(
      willLead({ fishesFed: 1, isSwimming: true, nearestStructureDistance: LEAD_DISTANCE_MAX + 1 }),
    ).toBe(false);
  });

  it('swim boost needs swim + proximity', () => {
    expect(
      swimBoostActive({ fishesFed: 0, isSwimming: true, nearestStructureDistance: null }, 2),
    ).toBe(true);
    expect(
      swimBoostActive({ fishesFed: 0, isSwimming: true, nearestStructureDistance: null }, 20),
    ).toBe(false);
  });

  it('accepts fish', () => {
    expect(accepts('cod')).toBe(true);
    expect(accepts('apple')).toBe(false);
  });
});
