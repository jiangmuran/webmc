// Swim physics. In water the player moves at 0.8× ground speed, with
// buoyancy proportional to (1 - depth_ratio). Depth Strider reduces the
// movement-speed penalty; Dolphin's Grace multiplies swim speed. Sprint
// + swim toggles the "swimming" body pose.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SwimQuery {
  velocity: Vec3;
  inWater: boolean;
  headInWater: boolean;
  sneaking: boolean;
  depthStriderLevel: number; // 0..3
  dolphinsGrace: boolean;
  sprinting: boolean;
}

const BASE_SWIM_SPEED = 0.8;
const DOLPHINS_GRACE_FACTOR = 1.5;
const BUOYANCY = 0.04;
const DRAG_IN_WATER = 0.94;
const SINK_WHILE_SNEAK = -0.04;

export interface SwimTickResult {
  velocity: Vec3;
  pose: 'standing' | 'swimming';
}

export function tickSwim(q: SwimQuery, forwardInput: number, strafeInput: number): SwimTickResult {
  if (!q.inWater) {
    return { velocity: q.velocity, pose: 'standing' };
  }
  let speed = BASE_SWIM_SPEED;
  if (q.depthStriderLevel > 0) {
    const l = Math.min(3, q.depthStriderLevel);
    speed += l * 0.066; // fully cancels water penalty at level 3
  }
  if (q.dolphinsGrace) speed *= DOLPHINS_GRACE_FACTOR;

  const out: Vec3 = {
    x: q.velocity.x + strafeInput * speed * 0.1,
    y: q.velocity.y,
    z: q.velocity.z + forwardInput * speed * 0.1,
  };

  // Buoyancy + drag.
  out.y += BUOYANCY;
  if (q.sneaking) out.y += SINK_WHILE_SNEAK;
  out.x *= DRAG_IN_WATER;
  out.y *= DRAG_IN_WATER;
  out.z *= DRAG_IN_WATER;

  const pose: 'swimming' | 'standing' = q.sprinting && q.headInWater ? 'swimming' : 'standing';
  return { velocity: out, pose };
}

// Air supply: 15 seconds base. Respiration enchant adds 15s per level.
// Conduit power or water breathing cancel drowning.
export interface BreathQuery {
  headInWater: boolean;
  respirationLevel: number;
  hasWaterBreathing: boolean;
  hasConduitPower: boolean;
  breathSec: number;
}

const MAX_BREATH_SEC = 15;

export interface BreathTickResult {
  breathSec: number;
  drownDamage: number;
}

export function tickBreath(q: BreathQuery, dtSec: number): BreathTickResult {
  const immune = q.hasWaterBreathing || q.hasConduitPower;
  const maxSec = MAX_BREATH_SEC + q.respirationLevel * MAX_BREATH_SEC;
  if (!q.headInWater || immune) {
    return { breathSec: Math.min(maxSec, q.breathSec + dtSec * 5), drownDamage: 0 };
  }
  const next = q.breathSec - dtSec;
  if (next <= 0) {
    return { breathSec: 0, drownDamage: 2 * dtSec };
  }
  return { breathSec: next, drownDamage: 0 };
}
