// Vex. Flying summon from an Evoker; passes through blocks; stops
// existing when its summoner dies, or 30-120 seconds after spawn.

export interface Vex {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  summonerId: number | null;
  lifetimeSec: number;
  ageSec: number;
}

export function makeVex(
  spawnPos: { x: number; y: number; z: number },
  summonerId: number,
  rng: () => number = Math.random,
): Vex {
  return {
    position: { ...spawnPos },
    velocity: { x: 0, y: 0, z: 0 },
    summonerId,
    lifetimeSec: 30 + rng() * 90,
    ageSec: 0,
  };
}

export interface VexTickCtx {
  dtSec: number;
  summonerAlive: boolean;
  targetPos: { x: number; y: number; z: number } | null;
}

export interface VexTickResult {
  expired: boolean;
}

export function tickVex(state: Vex, ctx: VexTickCtx): VexTickResult {
  state.ageSec += ctx.dtSec;
  if (!ctx.summonerAlive) return { expired: true };
  if (state.ageSec >= state.lifetimeSec) return { expired: true };
  if (ctx.targetPos) {
    const dx = ctx.targetPos.x - state.position.x;
    const dy = ctx.targetPos.y - state.position.y;
    const dz = ctx.targetPos.z - state.position.z;
    const dist = Math.hypot(dx, dy, dz) || 1;
    // Wiki (minecraft.wiki/w/Vex): movement speed 0.7 b/tick = 14 b/s.
    // Old constant of 2 b/s left vex chasing molasses-slow.
    const speed = 14;
    state.velocity.x = (dx / dist) * speed;
    state.velocity.y = (dy / dist) * speed;
    state.velocity.z = (dz / dist) * speed;
  }
  state.position.x += state.velocity.x * ctx.dtSec;
  state.position.y += state.velocity.y * ctx.dtSec;
  state.position.z += state.velocity.z * ctx.dtSec;
  return { expired: false };
}
