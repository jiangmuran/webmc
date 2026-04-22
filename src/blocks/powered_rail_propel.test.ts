import { describe, it, expect } from 'vitest';
import {
  cartAcceleration,
  propagates,
  accelerateEmptyCart,
  POWERED_RAIL_PROPAGATION,
} from './powered_rail_propel';

describe('powered rail', () => {
  it('powered accelerates', () => {
    expect(cartAcceleration({ poweredByRedstone: true, uphill: false })).toBeGreaterThan(0);
  });

  it('unpowered brakes', () => {
    expect(cartAcceleration({ poweredByRedstone: false, uphill: false })).toBeLessThan(0);
  });

  it('uphill faster accel', () => {
    expect(cartAcceleration({ poweredByRedstone: true, uphill: true })).toBeGreaterThan(
      cartAcceleration({ poweredByRedstone: true, uphill: false }),
    );
  });

  it('propagation limit 9', () => {
    expect(POWERED_RAIL_PROPAGATION).toBe(9);
    expect(propagates(8)).toBe(true);
    expect(propagates(9)).toBe(false);
  });

  it('empty cart accelerates on powered', () => {
    expect(accelerateEmptyCart({ poweredByRedstone: true, uphill: false })).toBe(true);
  });
});
