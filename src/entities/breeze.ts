// Breeze (1.21 Trial Chamber mob). Air-based enemy that jumps around on
// platforms and shoots wind-charge projectiles. Can inflict wind_charged
// effect on hit. Drops breeze_rod on death (mace ingredient).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type BreezeStance = 'idle' | 'jumping' | 'shooting' | 'dying';

export interface BreezeState {
  id: number;
  position: Vec3;
  velocity: Vec3;
  target: Vec3 | null;
  stance: BreezeStance;
  health: number;
  jumpCooldownSec: number;
  shootCooldownSec: number;
}

export const BREEZE_MAX_HEALTH = 30;
const JUMP_INTERVAL_SEC = 4;
const SHOOT_INTERVAL_SEC = 1.5;
const JUMP_IMPULSE_Y = 9;
const SHOOT_RANGE = 20;

export function makeBreeze(id: number, at: Vec3): BreezeState {
  return {
    id,
    position: { ...at },
    velocity: { x: 0, y: 0, z: 0 },
    target: null,
    stance: 'idle',
    health: BREEZE_MAX_HEALTH,
    jumpCooldownSec: 0,
    shootCooldownSec: 0,
  };
}

export interface BreezeTickResult {
  shouldShoot: boolean;
  shouldJump: boolean;
}

export function tickBreeze(state: BreezeState, dtSec: number): BreezeTickResult {
  if (state.stance === 'dying') return { shouldShoot: false, shouldJump: false };
  state.jumpCooldownSec = Math.max(0, state.jumpCooldownSec - dtSec);
  state.shootCooldownSec = Math.max(0, state.shootCooldownSec - dtSec);

  let shouldJump = false;
  let shouldShoot = false;

  if (state.target) {
    const dx = state.target.x - state.position.x;
    const dy = state.target.y - state.position.y;
    const dz = state.target.z - state.position.z;
    const dist = Math.hypot(dx, dy, dz);

    if (state.jumpCooldownSec === 0 && dist < 8) {
      shouldJump = true;
      state.velocity.y = JUMP_IMPULSE_Y;
      state.stance = 'jumping';
      state.jumpCooldownSec = JUMP_INTERVAL_SEC;
    } else if (state.shootCooldownSec === 0 && dist < SHOOT_RANGE) {
      shouldShoot = true;
      state.stance = 'shooting';
      state.shootCooldownSec = SHOOT_INTERVAL_SEC;
    } else {
      state.stance = 'idle';
    }
  }

  return { shouldShoot, shouldJump };
}

export function damageBreeze(state: BreezeState, amount: number): number {
  if (state.stance === 'dying') return 0;
  const dealt = Math.min(state.health, amount);
  state.health -= dealt;
  if (state.health <= 0) state.stance = 'dying';
  return dealt;
}

export interface BreezeDrop {
  item: 'webmc:breeze_rod';
  count: number;
}

// Wiki (minecraft.wiki/w/Breeze#Drops): "Breeze Rod (quantity=1-2,
// lootingquantity=1-2, only when killed by player or pet)." Old
// formula gave base 1 + floor(rand × (looting+1)), yielding 1 at
// Looting 0 (vs wiki 1-2) and 1-4 at Looting III (vs wiki 4-8).
// Now base rolls 1-2 and each Looting level adds an independent
// 1-2 roll, matching the wiki's lootingquantity notation. Caller
// supplies the killed-by-player check; this just computes the
// stack size when the drop fires.
export function breezeDrops(lootingLevel: number, rand: () => number = Math.random): BreezeDrop[] {
  let count = 1 + Math.floor(rand() * 2); // 1-2 base
  for (let i = 0; i < Math.max(0, lootingLevel); i++) {
    count += 1 + Math.floor(rand() * 2); // +1-2 per level
  }
  return [{ item: 'webmc:breeze_rod', count }];
}
