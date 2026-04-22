// End crystals: tiny floating entities on top of obsidian pillars during
// the ender dragon fight. Each crystal heals the dragon over time while
// alive; destroying crystals cripples the boss. Explodes when hit.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface EndCrystal {
  id: number;
  pos: Vec3;
  active: boolean;
  beamTargetId: number | null; // the dragon's id
  healCooldownSec: number;
  showBase: boolean;
}

const HEAL_PER_SEC = 1;
const HEAL_INTERVAL_SEC = 1;
const EXPLOSION_POWER = 6;

export function makeEndCrystal(id: number, pos: Vec3): EndCrystal {
  return { id, pos, active: true, beamTargetId: null, healCooldownSec: 0, showBase: true };
}

export interface CrystalTickContext {
  dragonPos: Vec3 | null;
  dragonId: number | null;
  dragonInRange: boolean; // within 32 blocks
  dragonCurrentHp: number;
  dragonMaxHp: number;
}

export interface CrystalTickResult {
  appliedHeal: number;
}

export function tickEndCrystal(
  state: EndCrystal,
  dtSec: number,
  ctx: CrystalTickContext,
): CrystalTickResult {
  if (!state.active || ctx.dragonId === null || !ctx.dragonInRange) {
    state.beamTargetId = null;
    return { appliedHeal: 0 };
  }
  state.beamTargetId = ctx.dragonId;
  state.healCooldownSec = Math.max(0, state.healCooldownSec - dtSec);
  if (state.healCooldownSec > 0) return { appliedHeal: 0 };
  if (ctx.dragonCurrentHp >= ctx.dragonMaxHp) return { appliedHeal: 0 };
  state.healCooldownSec = HEAL_INTERVAL_SEC;
  return { appliedHeal: HEAL_PER_SEC };
}

// Destroy the crystal (explodes).
export interface CrystalDestructionResult {
  exploded: boolean;
  explosionPower: number;
}

export function destroyEndCrystal(state: EndCrystal): CrystalDestructionResult {
  if (!state.active) return { exploded: false, explosionPower: 0 };
  state.active = false;
  return { exploded: true, explosionPower: EXPLOSION_POWER };
}
