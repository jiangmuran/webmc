// Silverfish. Hides in infested stone blocks; emerges when block is
// broken or the fish is damaged. Swarms — one silverfish calls nearby
// silverfish + infested blocks within 21 blocks.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SilverfishState {
  hp: number;
  aggroedNearby: boolean;
}

export function makeSilverfish(): SilverfishState {
  return { hp: 8, aggroedNearby: false };
}

// Breaking infested_stone reveals a silverfish.
export interface InfestedBreakResult {
  silverfishSpawned: boolean;
  dropsBlockVariant: string | null;
}

export function onInfestedBlockBroken(
  infestedName: string,
  silkTouch: boolean,
): InfestedBreakResult {
  if (silkTouch) return { silverfishSpawned: false, dropsBlockVariant: infestedName };
  return { silverfishSpawned: true, dropsBlockVariant: null };
}

// When hurt, call nearby silverfish within 21 blocks + infested blocks
// within 3 to release their silverfish.
export interface SwarmCallCtx {
  silverfish: readonly { id: number; pos: Vec3 }[];
  infestedBlocks: readonly { pos: Vec3 }[];
  hurtPos: Vec3;
}

export interface SwarmResult {
  alertedSilverfishIds: readonly number[];
  releaseInfested: readonly Vec3[];
}

export function callSwarm(ctx: SwarmCallCtx): SwarmResult {
  const alerted: number[] = [];
  for (const s of ctx.silverfish) {
    const dx = s.pos.x - ctx.hurtPos.x;
    const dy = s.pos.y - ctx.hurtPos.y;
    const dz = s.pos.z - ctx.hurtPos.z;
    if (Math.hypot(dx, dy, dz) <= 21) alerted.push(s.id);
  }
  const released: Vec3[] = [];
  for (const b of ctx.infestedBlocks) {
    const dx = b.pos.x - ctx.hurtPos.x;
    const dy = b.pos.y - ctx.hurtPos.y;
    const dz = b.pos.z - ctx.hurtPos.z;
    if (Math.hypot(dx, dy, dz) <= 3) released.push(b.pos);
  }
  return { alertedSilverfishIds: alerted, releaseInfested: released };
}
