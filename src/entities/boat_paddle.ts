// Boat paddle animation + input → velocity. Each oar has an independent
// rotation cycle when the corresponding movement key is held. Both oars
// pulling forward = forward thrust; opposite rotations = turn.

export interface BoatPaddleInput {
  leftPull: boolean; // D on keyboard (rowing in reverse style) OR W+right
  rightPull: boolean;
  reverseLeft: boolean;
  reverseRight: boolean;
  dtSec: number;
}

export interface BoatPaddleState {
  leftPhase: number; // 0..2π
  rightPhase: number;
}

const OAR_SPEED_RAD_PER_SEC = 6;
const FORWARD_THRUST = 0.04;
const TURN_TORQUE = 0.03;

export function makePaddleState(): BoatPaddleState {
  return { leftPhase: 0, rightPhase: 0 };
}

export interface PaddleResult {
  forwardThrust: number;
  turnTorque: number; // positive = rotate left
}

export function tickPaddle(state: BoatPaddleState, input: BoatPaddleInput): PaddleResult {
  const leftActive = input.leftPull || input.reverseLeft;
  const rightActive = input.rightPull || input.reverseRight;
  if (leftActive) state.leftPhase += OAR_SPEED_RAD_PER_SEC * input.dtSec;
  if (rightActive) state.rightPhase += OAR_SPEED_RAD_PER_SEC * input.dtSec;
  state.leftPhase %= Math.PI * 2;
  state.rightPhase %= Math.PI * 2;

  const leftDir = input.leftPull ? 1 : input.reverseLeft ? -1 : 0;
  const rightDir = input.rightPull ? 1 : input.reverseRight ? -1 : 0;
  const forward = (leftDir + rightDir) * FORWARD_THRUST;
  const torque = (leftDir - rightDir) * TURN_TORQUE;
  return { forwardThrust: forward, turnTorque: torque };
}

// Paddle sound triggers at the "splash" point of each oar's cycle
// (roughly each full revolution).
const SPLASH_COOLDOWN_RAD = Math.PI * 2;

export interface SplashState {
  leftAccum: number;
  rightAccum: number;
}

export function makeSplashState(): SplashState {
  return { leftAccum: 0, rightAccum: 0 };
}

export interface SplashResult {
  leftSplash: boolean;
  rightSplash: boolean;
}

export function tickSplashes(
  splash: SplashState,
  state: BoatPaddleState,
  input: BoatPaddleInput,
): SplashResult {
  const leftActive = input.leftPull || input.reverseLeft;
  const rightActive = input.rightPull || input.reverseRight;
  if (leftActive) splash.leftAccum += OAR_SPEED_RAD_PER_SEC * input.dtSec;
  if (rightActive) splash.rightAccum += OAR_SPEED_RAD_PER_SEC * input.dtSec;
  void state;
  let leftSplash = false;
  let rightSplash = false;
  while (splash.leftAccum >= SPLASH_COOLDOWN_RAD) {
    splash.leftAccum -= SPLASH_COOLDOWN_RAD;
    leftSplash = true;
  }
  while (splash.rightAccum >= SPLASH_COOLDOWN_RAD) {
    splash.rightAccum -= SPLASH_COOLDOWN_RAD;
    rightSplash = true;
  }
  return { leftSplash, rightSplash };
}
