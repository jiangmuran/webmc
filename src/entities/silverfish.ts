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

// When hurt by player or Poison damage and survives, call nearby
// silverfish + release infested blocks within a 21×11×21 box.
//
// Wiki (minecraft.wiki/w/Silverfish#Behavior): "When they suffer
// Poison damage or damage inflicted by the player and survive, they
// cause other silverfish within a 21×11×21 area to break out of
// their infested blocks." → ±10 blocks horizontal, ±5 vertical from
// the hurt silverfish.
//
// Old infested-block radius was 3 (Euclidean), so an infested block
// even 5 blocks away would silently fail to break — most stronghold
// "wall of silverfish" experiences couldn't trigger from a single
// hit. Now uses the wiki's canonical 21×11×21 box for both alerted
// silverfish and released infested blocks.

export interface SwarmCallCtx {
  silverfish: readonly { id: number; pos: Vec3 }[];
  infestedBlocks: readonly { pos: Vec3 }[];
  hurtPos: Vec3;
}

export interface SwarmResult {
  alertedSilverfishIds: readonly number[];
  releaseInfested: readonly Vec3[];
}

const SWARM_HALF_HORIZONTAL = 10; // 21 wide → ±10
const SWARM_HALF_VERTICAL = 5; // 11 tall → ±5

function inSwarmBox(here: Vec3, there: Vec3): boolean {
  return (
    Math.abs(there.x - here.x) <= SWARM_HALF_HORIZONTAL &&
    Math.abs(there.y - here.y) <= SWARM_HALF_VERTICAL &&
    Math.abs(there.z - here.z) <= SWARM_HALF_HORIZONTAL
  );
}

export function callSwarm(ctx: SwarmCallCtx): SwarmResult {
  const alerted: number[] = [];
  for (const s of ctx.silverfish) {
    if (inSwarmBox(ctx.hurtPos, s.pos)) alerted.push(s.id);
  }
  const released: Vec3[] = [];
  for (const b of ctx.infestedBlocks) {
    if (inSwarmBox(ctx.hurtPos, b.pos)) released.push(b.pos);
  }
  return { alertedSilverfishIds: alerted, releaseInfested: released };
}
