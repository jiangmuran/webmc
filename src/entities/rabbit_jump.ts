// Rabbit jump. Rabbits hop in 0.4-1.0s intervals; each hop = a small
// upward + forward impulse. Killer bunny variant jumps faster + deals
// damage on contact.

export interface RabbitState {
  hopCooldownSec: number;
  isKillerBunny: boolean;
}

export function makeRabbit(killerBunny = false): RabbitState {
  return { hopCooldownSec: 0, isKillerBunny: killerBunny };
}

export interface HopTickCtx {
  dtSec: number;
  moving: boolean;
  rng: () => number;
}

export interface HopResult {
  hops: boolean;
  velocity: { x: number; y: number; z: number };
}

export function tickRabbit(state: RabbitState, ctx: HopTickCtx, yawRad: number): HopResult {
  state.hopCooldownSec = Math.max(0, state.hopCooldownSec - ctx.dtSec);
  if (!ctx.moving || state.hopCooldownSec > 0) {
    return { hops: false, velocity: { x: 0, y: 0, z: 0 } };
  }
  state.hopCooldownSec = state.isKillerBunny ? 0.3 + ctx.rng() * 0.2 : 0.4 + ctx.rng() * 0.6;
  const forwardSpeed = state.isKillerBunny ? 3 : 1.2;
  const jumpY = 4;
  const sin = Math.sin(yawRad);
  const cos = Math.cos(yawRad);
  return {
    hops: true,
    velocity: {
      x: -sin * forwardSpeed,
      y: jumpY,
      z: -cos * forwardSpeed,
    },
  };
}

export const KILLER_BUNNY_CONTACT_DAMAGE = 8;
