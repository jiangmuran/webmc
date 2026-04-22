// Trident flight + loyalty tracking. The trident is an entity while in
// flight, not just the item. This module encodes its motion state and
// how loyalty pulls it back toward the owner on stuck / bounce.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type TridentPhase = 'flying' | 'stuck' | 'returning' | 'picked_up';

export interface TridentEntity {
  id: number;
  position: Vec3;
  velocity: Vec3;
  phase: TridentPhase;
  loyaltyLevel: number;
  ownerId: string;
  ownerPosHint: Vec3 | null;
  ageSec: number;
}

export function makeTridentEntity(
  id: number,
  from: Vec3,
  dir: Vec3,
  ownerId: string,
  loyaltyLevel = 0,
  speed = 2.5,
): TridentEntity {
  const mag = Math.hypot(dir.x, dir.y, dir.z) || 1;
  return {
    id,
    position: { ...from },
    velocity: {
      x: (dir.x / mag) * speed,
      y: (dir.y / mag) * speed,
      z: (dir.z / mag) * speed,
    },
    phase: 'flying',
    loyaltyLevel,
    ownerId,
    ownerPosHint: null,
    ageSec: 0,
  };
}

export interface TridentTickCtx {
  ownerPos: Vec3 | null;
  isSolid: (x: number, y: number, z: number) => boolean;
  inWater: boolean;
  dtSec: number;
}

const GRAVITY = 0.6;
const WATER_DRAG = 0.99;
const AIR_DRAG = 0.99;

export interface TridentTickResult {
  hitBlock: boolean;
  picked: boolean;
}

export function tickTrident(state: TridentEntity, ctx: TridentTickCtx): TridentTickResult {
  state.ageSec += ctx.dtSec;
  if (state.phase === 'picked_up') return { hitBlock: false, picked: true };

  if (state.phase === 'flying') {
    state.position.x += state.velocity.x * ctx.dtSec;
    state.position.y += state.velocity.y * ctx.dtSec;
    state.position.z += state.velocity.z * ctx.dtSec;
    state.velocity.y -= GRAVITY * ctx.dtSec;
    const drag = ctx.inWater ? WATER_DRAG : AIR_DRAG;
    state.velocity.x *= drag;
    state.velocity.y *= drag;
    state.velocity.z *= drag;
    const hit = ctx.isSolid(
      Math.floor(state.position.x),
      Math.floor(state.position.y),
      Math.floor(state.position.z),
    );
    if (hit) {
      state.phase = state.loyaltyLevel > 0 ? 'returning' : 'stuck';
      state.velocity = { x: 0, y: 0, z: 0 };
      return { hitBlock: true, picked: false };
    }
  }

  if (state.phase === 'returning' && ctx.ownerPos) {
    const dx = ctx.ownerPos.x - state.position.x;
    const dy = ctx.ownerPos.y - state.position.y;
    const dz = ctx.ownerPos.z - state.position.z;
    const dist = Math.hypot(dx, dy, dz);
    if (dist < 1.5) {
      state.phase = 'picked_up';
      return { hitBlock: false, picked: true };
    }
    const speed = 0.5 + state.loyaltyLevel * 0.5;
    state.velocity = {
      x: (dx / dist) * speed,
      y: (dy / dist) * speed,
      z: (dz / dist) * speed,
    };
    state.position.x += state.velocity.x * ctx.dtSec * 20;
    state.position.y += state.velocity.y * ctx.dtSec * 20;
    state.position.z += state.velocity.z * ctx.dtSec * 20;
  }

  return { hitBlock: false, picked: false };
}
