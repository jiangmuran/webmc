// Fishing hook entity. Thrown by the fishing rod; sits on water, bobs,
// attracts bites after a random wait. Landing on an entity hooks it
// (can pull mobs or items); landing on a block sticks unless water.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type HookPhase = 'in_flight' | 'bobbing' | 'hooked_entity' | 'retrieved';

export interface FishingHook {
  id: number;
  ownerId: string;
  position: Vec3;
  velocity: Vec3;
  phase: HookPhase;
  ticksUntilBite: number;
  hookedEntityId: number | null;
}

export function makeFishingHook(
  id: number,
  ownerId: string,
  from: Vec3,
  dir: Vec3,
  speed = 1.5,
): FishingHook {
  const m = Math.hypot(dir.x, dir.y, dir.z) || 1;
  return {
    id,
    ownerId,
    position: { ...from },
    velocity: {
      x: (dir.x / m) * speed,
      y: (dir.y / m) * speed,
      z: (dir.z / m) * speed,
    },
    phase: 'in_flight',
    ticksUntilBite: 0,
    hookedEntityId: null,
  };
}

const GRAVITY = 2;

export interface HookTickCtx {
  isWater: (x: number, y: number, z: number) => boolean;
  isSolid: (x: number, y: number, z: number) => boolean;
  nearbyEntities: readonly { id: number; pos: Vec3 }[];
  dtSec: number;
  rng: () => number;
}

export interface HookTickResult {
  biteReady: boolean;
  entityHit: number | null;
}

export function tickFishingHook(state: FishingHook, ctx: HookTickCtx): HookTickResult {
  if (state.phase === 'in_flight') {
    state.position.x += state.velocity.x * ctx.dtSec;
    state.position.y += state.velocity.y * ctx.dtSec;
    state.position.z += state.velocity.z * ctx.dtSec;
    state.velocity.y -= GRAVITY * ctx.dtSec;

    // Entity hit?
    for (const e of ctx.nearbyEntities) {
      const dx = e.pos.x - state.position.x;
      const dy = e.pos.y - state.position.y;
      const dz = e.pos.z - state.position.z;
      if (Math.hypot(dx, dy, dz) < 1.2) {
        state.phase = 'hooked_entity';
        state.hookedEntityId = e.id;
        return { biteReady: false, entityHit: e.id };
      }
    }

    const bx = Math.floor(state.position.x);
    const by = Math.floor(state.position.y);
    const bz = Math.floor(state.position.z);
    if (ctx.isWater(bx, by, bz)) {
      state.phase = 'bobbing';
      state.velocity = { x: 0, y: 0, z: 0 };
      // Random wait: 5-30s.
      state.ticksUntilBite = Math.floor(100 + ctx.rng() * 500);
    } else if (ctx.isSolid(bx, by, bz)) {
      state.phase = 'retrieved';
    }
    return { biteReady: false, entityHit: null };
  }

  if (state.phase === 'bobbing') {
    state.ticksUntilBite--;
    if (state.ticksUntilBite <= 0) {
      return { biteReady: true, entityHit: null };
    }
  }
  return { biteReady: false, entityHit: null };
}

// Reeling in: if bobbing and bite is ready, produce a fish drop; if
// hooked an entity, pull it toward the owner; otherwise retrieve empty.
export interface ReelQuery {
  hook: FishingHook;
  ownerPos: Vec3;
  biteReady: boolean;
  lureLevel: number;
}

export interface ReelResult {
  caughtItem: string | null;
  pulledEntityDelta: Vec3 | null;
  hookRemoved: boolean;
}

export function reelIn(q: ReelQuery): ReelResult {
  if (q.hook.phase === 'hooked_entity') {
    const dx = q.ownerPos.x - q.hook.position.x;
    const dy = q.ownerPos.y - q.hook.position.y;
    const dz = q.ownerPos.z - q.hook.position.z;
    const mag = Math.hypot(dx, dy, dz) || 1;
    return {
      caughtItem: null,
      pulledEntityDelta: {
        x: (dx / mag) * 0.3,
        y: (dy / mag) * 0.3 + 0.1,
        z: (dz / mag) * 0.3,
      },
      hookRemoved: true,
    };
  }
  if (q.biteReady) {
    return { caughtItem: 'webmc:cod', pulledEntityDelta: null, hookRemoved: true };
  }
  return { caughtItem: null, pulledEntityDelta: null, hookRemoved: true };
}
