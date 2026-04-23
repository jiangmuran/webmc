import { describe, it, expect } from 'vitest';
import { vyAdjustment, horizontalMultiplier } from './buoyancy_swim_up';

describe('buoyancy swim up', () => {
  it('dry no adjust', () => {
    expect(
      vyAdjustment({ inWater: false, headSubmerged: false, pressingJump: false, sprinting: false }),
    ).toBe(0);
  });

  it('water lifts', () => {
    expect(
      vyAdjustment({ inWater: true, headSubmerged: false, pressingJump: false, sprinting: false }),
    ).toBeGreaterThan(0);
  });

  it('submerged jump accelerates up', () => {
    expect(
      vyAdjustment({ inWater: true, headSubmerged: true, pressingJump: true, sprinting: false }),
    ).toBeGreaterThan(
      vyAdjustment({ inWater: true, headSubmerged: true, pressingJump: false, sprinting: false }),
    );
  });

  it('dry full speed', () => {
    expect(
      horizontalMultiplier({
        inWater: false,
        headSubmerged: false,
        pressingJump: false,
        sprinting: false,
      }),
    ).toBe(1);
  });

  it('water slows', () => {
    expect(
      horizontalMultiplier({
        inWater: true,
        headSubmerged: false,
        pressingJump: false,
        sprinting: false,
      }),
    ).toBeLessThan(1);
  });
});
