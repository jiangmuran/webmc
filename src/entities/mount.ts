// Mount system: saddled pig (carrot-on-a-stick speed control), horse
// (jump strength, speed), camel (dash). Tracks rider + saddle + input
// translation to mob velocity.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type MountKind = 'pig' | 'horse' | 'camel' | 'strider' | 'donkey' | 'mule';

export interface MountStats {
  baseSpeed: number;
  jumpVelocity: number;
  dashVelocity: number;
}

export const MOUNT_STATS: Record<MountKind, MountStats> = {
  pig: { baseSpeed: 2.5, jumpVelocity: 0, dashVelocity: 0 },
  horse: { baseSpeed: 5, jumpVelocity: 8, dashVelocity: 0 },
  donkey: { baseSpeed: 4, jumpVelocity: 5, dashVelocity: 0 },
  mule: { baseSpeed: 4.5, jumpVelocity: 6, dashVelocity: 0 },
  camel: { baseSpeed: 4, jumpVelocity: 0, dashVelocity: 10 },
  strider: { baseSpeed: 1.8, jumpVelocity: 0, dashVelocity: 0 },
};

export interface MountState {
  kind: MountKind;
  saddled: boolean;
  riderId: number | null;
  carrotBoostSec: number; // for pig
  dashCooldownSec: number; // for camel
}

export function makeMount(kind: MountKind): MountState {
  return {
    kind,
    saddled: false,
    riderId: null,
    carrotBoostSec: 0,
    dashCooldownSec: 0,
  };
}

export function equipSaddle(state: MountState): boolean {
  if (state.saddled) return false;
  state.saddled = true;
  return true;
}

export function mount(state: MountState, playerId: number): boolean {
  if (state.riderId !== null) return false;
  if (!state.saddled && state.kind !== 'strider') return false;
  state.riderId = playerId;
  return true;
}

export function dismount(state: MountState): number | null {
  const r = state.riderId;
  state.riderId = null;
  return r;
}

export interface MountInput {
  forward: number;
  turn: number;
  jump: boolean;
  dash: boolean;
}

export interface MountStep {
  velocity: Vec3;
}

export function driveMount(
  state: MountState,
  input: MountInput,
  yawRad: number,
  dtSec: number,
): MountStep {
  const stats = MOUNT_STATS[state.kind];
  const speed =
    state.kind === 'pig' && state.carrotBoostSec > 0 ? stats.baseSpeed * 1.4 : stats.baseSpeed;
  const sin = Math.sin(yawRad);
  const cos = Math.cos(yawRad);
  let vx = -sin * input.forward * speed;
  let vz = -cos * input.forward * speed;
  let vy = 0;
  if (input.jump && stats.jumpVelocity > 0) vy = stats.jumpVelocity;
  if (input.dash && state.kind === 'camel' && state.dashCooldownSec <= 0) {
    vx += -sin * stats.dashVelocity;
    vz += -cos * stats.dashVelocity;
    state.dashCooldownSec = 8;
  }
  state.dashCooldownSec = Math.max(0, state.dashCooldownSec - dtSec);
  state.carrotBoostSec = Math.max(0, state.carrotBoostSec - dtSec);
  void input.turn; // (turn handled by yaw upstream)
  return { velocity: { x: vx, y: vy, z: vz } };
}

export function useCarrotOnStick(state: MountState): boolean {
  if (state.kind !== 'pig') return false;
  state.carrotBoostSec = 3;
  return true;
}
