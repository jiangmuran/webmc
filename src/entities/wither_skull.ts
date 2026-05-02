// Wither skull projectile. Fired by the wither boss; flies in a
// straight line, deals 8 HP on direct hit (Normal), applies the
// Wither II effect for 10 s (Normal) or 40 s (Hard), and explodes
// with power 1 on contact.
//
// Wiki (minecraft.wiki/w/Wither): "Black wither skulls explode with
// a blast power of 1, the same as a ghast's fireball, and cannot
// break blocks with a blast resistance above 4. Blue wither skulls
// have the same explosion strength, but move slower and are more
// destructive to terrain. They treat all breakable blocks as having
// a blast resistance lower than 0.8."
//
// "If either type of wither skull hits a player or mob, it does 8
// damage on Normal difficulty. It also inflicts Wither II for 10
// seconds on Normal difficulty and 40 seconds on Hard."
//
// Old constants:
//   WITHER_SKULL_DAMAGE = 6      (wiki: 8 on Normal)
//   CHARGED_POWER = 2            (wiki: same blast power as black, 1)
// The wiki says BOTH skull types have power 1 — only the
// block-break resistance differs (blue treats blocks as <0.8 BR).
// Power constants now both 1; sibling code that needs to model the
// blue-skull's higher block-break can branch on `charged` separately.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface WitherSkull {
  position: Vec3;
  velocity: Vec3;
  charged: boolean; // "blue" skulls (low-HP wither) — same power, more block-break
  ageSec: number;
}

const LIFETIME_SEC = 30;
const NORMAL_POWER = 1;
const CHARGED_POWER = 1; // wiki: blue and black skulls share blast power
const DRAG = 0.98;

export function makeWitherSkull(
  position: Vec3,
  direction: Vec3,
  speed: number,
  charged: boolean,
): WitherSkull {
  return {
    position: { ...position },
    velocity: {
      x: direction.x * speed,
      y: direction.y * speed,
      z: direction.z * speed,
    },
    charged,
    ageSec: 0,
  };
}

export interface WitherSkullTickContext {
  isSolid: (x: number, y: number, z: number) => boolean;
}

export interface WitherSkullResult {
  hitBlock: boolean;
  expired: boolean;
  explosionPower: number;
}

export function tickWitherSkull(
  state: WitherSkull,
  dtSec: number,
  ctx: WitherSkullTickContext,
): WitherSkullResult {
  state.ageSec += dtSec;
  state.position.x += state.velocity.x * dtSec;
  state.position.y += state.velocity.y * dtSec;
  state.position.z += state.velocity.z * dtSec;
  state.velocity.x *= DRAG;
  state.velocity.y *= DRAG;
  state.velocity.z *= DRAG;

  const expired = state.ageSec >= LIFETIME_SEC;
  const hitBlock = ctx.isSolid(
    Math.floor(state.position.x),
    Math.floor(state.position.y),
    Math.floor(state.position.z),
  );
  return {
    hitBlock,
    expired,
    explosionPower: hitBlock || expired ? (state.charged ? CHARGED_POWER : NORMAL_POWER) : 0,
  };
}

export const WITHER_SKULL_DAMAGE = 8; // Normal difficulty (wiki)
export const WITHER_EFFECT_DURATION_SEC = 10;
export const WITHER_EFFECT_DURATION_SEC_HARD = 40;
