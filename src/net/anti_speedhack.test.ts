import { describe, it, expect } from 'vitest';
import { isImpossible } from './anti_speedhack';

describe('anti speedhack', () => {
  it('normal sprint fine', () => {
    expect(
      isImpossible({
        dtMs: 1000,
        dx: 6,
        dy: 0,
        dz: 0,
        sprinting: true,
        elytraFlying: false,
      }),
    ).toBe(false);
  });

  it('100 m/s flagged', () => {
    expect(
      isImpossible({
        dtMs: 1000,
        dx: 100,
        dy: 0,
        dz: 0,
        sprinting: true,
        elytraFlying: false,
      }),
    ).toBe(true);
  });

  it('elytra allows higher speed', () => {
    expect(
      isImpossible({
        dtMs: 1000,
        dx: 40,
        dy: 0,
        dz: 0,
        sprinting: false,
        elytraFlying: true,
      }),
    ).toBe(false);
  });

  it('dt 0 is not impossible', () => {
    expect(
      isImpossible({
        dtMs: 0,
        dx: 100,
        dy: 0,
        dz: 0,
        sprinting: true,
        elytraFlying: false,
      }),
    ).toBe(false);
  });
});
