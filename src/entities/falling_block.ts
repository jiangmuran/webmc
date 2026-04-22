// Falling block. Sand / gravel / anvil / concrete powder / pointed
// dripstone fall when the block below becomes non-solid. Deals damage
// from anvils/dripstone; bursts on non-full block (landing on slab etc.).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface FallingBlock {
  position: Vec3;
  velocity: Vec3;
  blockName: string;
  fallDistance: number;
  hurtEntities: boolean; // true for anvils + dripstone
}

const GRAVITY = 20;
const TERMINAL = 78.4;

export function makeFallingBlock(pos: Vec3, blockName: string): FallingBlock {
  const hurtEntities = blockName.includes('anvil') || blockName.includes('pointed_dripstone');
  return {
    position: { ...pos },
    velocity: { x: 0, y: 0, z: 0 },
    blockName,
    fallDistance: 0,
    hurtEntities,
  };
}

export interface FallingTickCtx {
  isSolidBelow: (x: number, y: number, z: number) => boolean;
  dtSec: number;
}

export interface FallingTickResult {
  landed: boolean;
  landedPos: Vec3 | null;
  damageToEntitiesAtLanding: number;
}

export function tickFallingBlock(state: FallingBlock, ctx: FallingTickCtx): FallingTickResult {
  state.velocity.y = Math.max(state.velocity.y - GRAVITY * ctx.dtSec, -TERMINAL);
  const dy = state.velocity.y * ctx.dtSec;
  state.position.y += dy;
  state.fallDistance += Math.max(0, -dy);
  const bx = Math.floor(state.position.x);
  const by = Math.floor(state.position.y);
  const bz = Math.floor(state.position.z);
  if (ctx.isSolidBelow(bx, by, bz)) {
    const damage = state.hurtEntities ? Math.min(20, Math.floor(state.fallDistance * 2)) : 0;
    return {
      landed: true,
      landedPos: { x: bx, y: by + 1, z: bz },
      damageToEntitiesAtLanding: damage,
    };
  }
  return { landed: false, landedPos: null, damageToEntitiesAtLanding: 0 };
}
