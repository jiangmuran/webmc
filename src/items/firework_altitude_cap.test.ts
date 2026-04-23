import { describe, it, expect } from 'vitest';
import { altitudeInBounds, explodesIfOut, voidKillY } from './firework_altitude_cap';

describe('firework altitude cap', () => {
  it('mid air in bounds', () => {
    expect(altitudeInBounds(64)).toBe(true);
  });

  it('top cap', () => {
    expect(altitudeInBounds(500)).toBe(false);
    expect(explodesIfOut(500)).toBe(true);
  });

  it('void below', () => {
    expect(voidKillY()).toBeLessThan(-64);
  });
});
