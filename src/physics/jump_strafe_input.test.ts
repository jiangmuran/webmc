import { describe, it, expect } from 'vitest';
import {
  movementVelocity,
  jumpVelocity,
  JUMP_VELOCITY,
  type MovementInput,
} from './jump_strafe_input';

const idle: MovementInput = {
  forward: 0,
  strafe: 0,
  jumping: false,
  sneaking: false,
  sprinting: false,
};

describe('jump/strafe input', () => {
  it('idle no velocity', () => {
    expect(movementVelocity(idle, 0)).toEqual({ vx: 0, vz: 0 });
  });

  it('forward moves', () => {
    const v = movementVelocity({ ...idle, forward: 1 }, 0);
    expect(Math.abs(v.vz)).toBeGreaterThan(0);
  });

  it('sprint faster than walk', () => {
    const walk = movementVelocity({ ...idle, forward: 1 }, 0);
    const sprint = movementVelocity({ ...idle, forward: 1, sprinting: true }, 0);
    expect(Math.abs(sprint.vz)).toBeGreaterThan(Math.abs(walk.vz));
  });

  it('sneak slower', () => {
    const walk = movementVelocity({ ...idle, forward: 1 }, 0);
    const sneak = movementVelocity({ ...idle, forward: 1, sneaking: true }, 0);
    expect(Math.abs(sneak.vz)).toBeLessThan(Math.abs(walk.vz));
  });

  it('jump impulse > 0', () => {
    expect(JUMP_VELOCITY).toBeGreaterThan(0);
  });

  it('jump boost helps', () => {
    expect(jumpVelocity(2)).toBeGreaterThan(JUMP_VELOCITY);
  });
});
