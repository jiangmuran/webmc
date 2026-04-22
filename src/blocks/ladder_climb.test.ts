import { describe, it, expect } from 'vitest';
import {
  verticalVelocity,
  supportsFromSolidBacking,
  preventsFallDamage,
  LADDER_CLIMB_SPEED,
  LADDER_DESCEND_SPEED,
} from './ladder_climb';

describe('ladder climb', () => {
  it('up climbs', () => {
    expect(
      verticalVelocity({ onLadder: true, inputUp: true, inputDown: false, isSneaking: false }),
    ).toBe(LADDER_CLIMB_SPEED);
  });

  it('down descends', () => {
    expect(
      verticalVelocity({ onLadder: true, inputUp: false, inputDown: true, isSneaking: false }),
    ).toBe(-LADDER_DESCEND_SPEED);
  });

  it('sneak holds position', () => {
    expect(
      verticalVelocity({ onLadder: true, inputUp: true, inputDown: false, isSneaking: true }),
    ).toBe(0);
  });

  it('off ladder falls', () => {
    expect(
      verticalVelocity({ onLadder: false, inputUp: true, inputDown: false, isSneaking: false }),
    ).toBe(0);
  });

  it('requires solid backing', () => {
    expect(supportsFromSolidBacking(true)).toBe(true);
    expect(supportsFromSolidBacking(false)).toBe(false);
  });

  it('prevents fall damage', () => {
    expect(preventsFallDamage()).toBe(true);
  });
});
