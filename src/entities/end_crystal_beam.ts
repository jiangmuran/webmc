// End crystal healing beam. Active end crystals on obsidian pillars heal
// the Ender Dragon if it's within line of sight of the crystal. Visual is
// a beam from crystal to dragon's head; damage hits chain-react to adjacent
// crystals via an explosion.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface EndCrystalState {
  id: number;
  position: Vec3;
  alive: boolean;
  beamTarget: Vec3 | null;
}

export function makeEndCrystal(id: number, at: Vec3): EndCrystalState {
  return { id, position: { ...at }, alive: true, beamTarget: null };
}

// Wiki (minecraft.wiki/w/End_Crystal): "Each end crystal heals the
// dragon at a rate of 1 HP per second when both are present and the
// dragon is within 32 blocks." 1 HP/sec at 20 ticks/sec = 1/20 HP
// per tick. Old `CRYSTAL_HEAL_PER_TICK = 1` was 20× too aggressive
// — the dragon regenerated 20 HP/sec per visible crystal, making
// the boss fight effectively unwinnable. Sibling
// ender_crystal_beam_link.ts also fixed.
export const CRYSTAL_HEAL_PER_TICK = 1 / 20;
export const CRYSTAL_HEAL_PER_SECOND = 1;
const HEAL_RADIUS_SQ = 32 * 32;

export interface BeamContext {
  dragonHead: Vec3 | null;
  hasLineOfSight: (from: Vec3, to: Vec3) => boolean;
}

export interface BeamResult {
  healing: boolean;
  amount: number;
}

export function tickCrystalBeam(state: EndCrystalState, ctx: BeamContext): BeamResult {
  if (!state.alive || !ctx.dragonHead) {
    state.beamTarget = null;
    return { healing: false, amount: 0 };
  }
  const dx = ctx.dragonHead.x - state.position.x;
  const dy = ctx.dragonHead.y - state.position.y;
  const dz = ctx.dragonHead.z - state.position.z;
  const distSq = dx * dx + dy * dy + dz * dz;
  if (distSq > HEAL_RADIUS_SQ) {
    state.beamTarget = null;
    return { healing: false, amount: 0 };
  }
  if (!ctx.hasLineOfSight(state.position, ctx.dragonHead)) {
    state.beamTarget = null;
    return { healing: false, amount: 0 };
  }
  state.beamTarget = { ...ctx.dragonHead };
  return { healing: true, amount: CRYSTAL_HEAL_PER_TICK };
}

// Destroying a crystal triggers a power-6 explosion at its position.
export const CRYSTAL_DESTRUCTION_EXPLOSION_POWER = 6;

export interface DestroyResult {
  explosionCenter: Vec3;
  explosionPower: number;
}

export function destroyCrystal(state: EndCrystalState): DestroyResult | null {
  if (!state.alive) return null;
  state.alive = false;
  state.beamTarget = null;
  return {
    explosionCenter: { ...state.position },
    explosionPower: CRYSTAL_DESTRUCTION_EXPLOSION_POWER,
  };
}
