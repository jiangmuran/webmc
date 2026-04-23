import { describe, it, expect } from 'vitest';
import { jumpVelocityY, sprintJumpBoost, JUMP_VELOCITY } from './jump_impulse';

describe('jump impulse', () => {
  it('base jump', () => {
    expect(
      jumpVelocityY({ sprinting: false, jumpBoostLevel: 0, inWater: false, inLava: false }),
    ).toBe(JUMP_VELOCITY);
  });

  it('jump boost adds', () => {
    expect(
      jumpVelocityY({ sprinting: false, jumpBoostLevel: 2, inWater: false, inLava: false }),
    ).toBeGreaterThan(JUMP_VELOCITY);
  });

  it('no jump in water', () => {
    expect(
      jumpVelocityY({ sprinting: false, jumpBoostLevel: 0, inWater: true, inLava: false }),
    ).toBe(0);
  });

  it('sprint no horizontal if not sprinting', () => {
    expect(
      sprintJumpBoost({ sprinting: false, jumpBoostLevel: 0, inWater: false, inLava: false }, 0),
    ).toEqual({ dx: 0, dz: 0 });
  });

  it('sprint pushes forward', () => {
    const r = sprintJumpBoost(
      { sprinting: true, jumpBoostLevel: 0, inWater: false, inLava: false },
      0,
    );
    expect(r.dz).toBeGreaterThan(0);
  });
});
