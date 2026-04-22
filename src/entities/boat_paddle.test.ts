import { describe, it, expect } from 'vitest';
import { makePaddleState, makeSplashState, tickPaddle, tickSplashes } from './boat_paddle';

const BASE_INPUT = {
  leftPull: false,
  rightPull: false,
  reverseLeft: false,
  reverseRight: false,
  dtSec: 0.1,
};

describe('boat paddle', () => {
  it('both pulls = forward thrust', () => {
    const s = makePaddleState();
    const r = tickPaddle(s, { ...BASE_INPUT, leftPull: true, rightPull: true });
    expect(r.forwardThrust).toBeGreaterThan(0);
    expect(r.turnTorque).toBe(0);
  });

  it('one pull = torque', () => {
    const s = makePaddleState();
    const r = tickPaddle(s, { ...BASE_INPUT, leftPull: true });
    expect(r.turnTorque).not.toBe(0);
  });

  it('reverse yields negative forward', () => {
    const s = makePaddleState();
    const r = tickPaddle(s, {
      ...BASE_INPUT,
      reverseLeft: true,
      reverseRight: true,
    });
    expect(r.forwardThrust).toBeLessThan(0);
  });

  it('paddle phase advances', () => {
    const s = makePaddleState();
    tickPaddle(s, { ...BASE_INPUT, leftPull: true, dtSec: 1 });
    expect(s.leftPhase).toBeGreaterThan(0);
  });

  it('splash fires once per cycle', () => {
    const splash = makeSplashState();
    const state = makePaddleState();
    const r = tickSplashes(splash, state, {
      ...BASE_INPUT,
      leftPull: true,
      rightPull: true,
      dtSec: 2,
    });
    expect(r.leftSplash).toBe(true);
    expect(r.rightSplash).toBe(true);
  });
});
