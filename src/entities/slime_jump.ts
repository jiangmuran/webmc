// Slime hop. Slimes move by hopping toward their target once per 10-20
// ticks (random), with hop height scaled by size. Size 1 is tiny; size
// 4 is a giant leap. On landing, pick a new target direction.

import type { MagmaCubeSize } from './magma_cube';

export type SlimeSize = MagmaCubeSize;

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SlimeHopState {
  size: SlimeSize;
  ticksUntilJump: number;
  facingAngleRad: number;
}

export function makeSlimeHop(size: SlimeSize): SlimeHopState {
  return { size, ticksUntilJump: 20, facingAngleRad: 0 };
}

export function hopVelocity(size: SlimeSize): { horizontal: number; vertical: number } {
  if (size === 1) return { horizontal: 0.3, vertical: 0.42 };
  if (size === 2) return { horizontal: 0.5, vertical: 0.55 };
  return { horizontal: 0.8, vertical: 0.7 };
}

export interface SlimeTickCtx {
  grounded: boolean;
  targetAngleRad: number | null;
  rng: () => number;
  dtTicks: number;
}

export interface SlimeHopResult {
  jump: boolean;
  horizontal: number;
  vertical: number;
}

export function tickSlimeHop(state: SlimeHopState, ctx: SlimeTickCtx): SlimeHopResult {
  state.ticksUntilJump = Math.max(0, state.ticksUntilJump - ctx.dtTicks);
  if (!ctx.grounded || state.ticksUntilJump > 0) {
    return { jump: false, horizontal: 0, vertical: 0 };
  }
  state.ticksUntilJump = 10 + Math.floor(ctx.rng() * 11);
  if (ctx.targetAngleRad !== null) state.facingAngleRad = ctx.targetAngleRad;
  const v = hopVelocity(state.size);
  return { jump: true, horizontal: v.horizontal, vertical: v.vertical };
}

// Slimes split on death: size 2→2-4 of size 1; size 4→2-4 of size 2;
// size 1 drops slimeballs (0-2).
export interface SlimeSplitResult {
  children: SlimeSize[];
  slimeballs: number;
}

export function slimeDeath(size: SlimeSize, rng: () => number): SlimeSplitResult {
  if (size === 1) {
    return { children: [], slimeballs: Math.floor(rng() * 3) };
  }
  const n = 2 + Math.floor(rng() * 3);
  const childSize: SlimeSize = size === 4 ? 2 : 1;
  return {
    children: Array.from({ length: n }, () => childSize),
    slimeballs: 0,
  };
}
