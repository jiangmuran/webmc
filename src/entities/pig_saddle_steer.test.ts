import { describe, it, expect } from 'vitest';
import {
  canSteer,
  effectiveSpeed,
  carrotUses,
  PIG_BASE_SPEED,
  PIG_BOOST_SPEED,
} from './pig_saddle_steer';

describe('pig saddle steer', () => {
  it('no saddle no steer', () => {
    expect(canSteer({ saddled: false, rider: 'p1', usingCarrot: false })).toBe(false);
  });

  it('saddled + rider steer', () => {
    expect(canSteer({ saddled: true, rider: 'p1', usingCarrot: false })).toBe(true);
  });

  it('base speed unridden', () => {
    expect(effectiveSpeed({ saddled: false, rider: null, usingCarrot: false })).toBe(
      PIG_BASE_SPEED,
    );
  });

  it('carrot boost', () => {
    expect(effectiveSpeed({ saddled: true, rider: 'p1', usingCarrot: true })).toBe(PIG_BOOST_SPEED);
  });

  it('carrot uses default 7', () => {
    expect(carrotUses()).toBe(7);
  });
});
