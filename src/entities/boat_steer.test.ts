import { describe, it, expect } from 'vitest';
import { tickBoat, currentMax, WATER_MAX, ICE_MAX, TURN_PER_TICK_DEG } from './boat_steer';

describe('boat steer', () => {
  it('both paddles accelerate forward', () => {
    const b = {
      forwardVel: 0,
      yaw: 0,
      leftPaddle: true,
      rightPaddle: true,
      onIce: false,
      onWater: true,
    };
    tickBoat(b);
    expect(b.forwardVel).toBeGreaterThan(0);
  });

  it('right paddle turns left', () => {
    const b = {
      forwardVel: 0,
      yaw: 0,
      leftPaddle: false,
      rightPaddle: true,
      onIce: false,
      onWater: true,
    };
    tickBoat(b);
    expect(b.yaw).toBe(-TURN_PER_TICK_DEG);
  });

  it('ice gives higher max', () => {
    expect(
      currentMax({
        forwardVel: 0,
        yaw: 0,
        leftPaddle: false,
        rightPaddle: false,
        onIce: true,
        onWater: false,
      }),
    ).toBe(ICE_MAX);
    expect(
      currentMax({
        forwardVel: 0,
        yaw: 0,
        leftPaddle: false,
        rightPaddle: false,
        onIce: false,
        onWater: true,
      }),
    ).toBe(WATER_MAX);
  });

  it('drag without paddles', () => {
    const b = {
      forwardVel: 0.3,
      yaw: 0,
      leftPaddle: false,
      rightPaddle: false,
      onIce: false,
      onWater: true,
    };
    tickBoat(b);
    expect(b.forwardVel).toBeLessThan(0.3);
  });

  it('out-of-water extra drag', () => {
    const b = {
      forwardVel: 0.3,
      yaw: 0,
      leftPaddle: false,
      rightPaddle: false,
      onIce: false,
      onWater: false,
    };
    tickBoat(b);
    expect(b.forwardVel).toBeLessThan(0.2);
  });
});
