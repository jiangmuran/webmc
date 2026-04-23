import { describe, it, expect } from 'vitest';
import { nextSpeed, powerRange } from './powered_rail_propulsion';

describe('powered rail propulsion', () => {
  it('powers accelerates', () => {
    const v = nextSpeed({ powered: true, minecartSpeed: 0, onHill: false });
    expect(v).toBeGreaterThan(0);
  });

  it('caps speed', () => {
    expect(nextSpeed({ powered: true, minecartSpeed: 100, onHill: false })).toBeLessThanOrEqual(8);
  });

  it('unpowered decays', () => {
    expect(nextSpeed({ powered: false, minecartSpeed: 4, onHill: false })).toBeLessThan(4);
  });

  it('uphill limited', () => {
    expect(nextSpeed({ powered: true, minecartSpeed: 10, onHill: true })).toBeLessThan(
      nextSpeed({ powered: true, minecartSpeed: 10, onHill: false }),
    );
  });

  it('power range 9', () => {
    expect(powerRange()).toBe(9);
  });
});
