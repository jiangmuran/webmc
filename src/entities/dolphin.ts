// Dolphin. Follows the player if fed raw cod/salmon, then escorts them
// to the nearest underwater ruin/shipwreck by swimming visibly ahead.
// Dolphins die on land after ~2 minutes without water.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type DolphinStance = 'idle' | 'follow' | 'escort' | 'suffocating' | 'dead';

export interface DolphinState {
  id: number;
  position: Vec3;
  stance: DolphinStance;
  health: number;
  fedBy: string | null; // player id
  escortTarget: Vec3 | null;
  secondsOutOfWater: number;
  secondsSinceFed: number;
}

export const DOLPHIN_MAX_HEALTH = 10;
const OUT_OF_WATER_LETHAL_SEC = 120;
const ESCORT_LIFETIME_SEC = 300; // 5 minutes after feeding

export function makeDolphin(id: number, at: Vec3): DolphinState {
  return {
    id,
    position: { ...at },
    stance: 'idle',
    health: DOLPHIN_MAX_HEALTH,
    fedBy: null,
    escortTarget: null,
    secondsOutOfWater: 0,
    secondsSinceFed: 0,
  };
}

export interface DolphinTickCtx {
  inWater: boolean;
  playerNearby: boolean;
  nearestStructure: Vec3 | null;
  dtSec: number;
}

export function tickDolphin(state: DolphinState, ctx: DolphinTickCtx): void {
  if (state.stance === 'dead') return;
  state.secondsOutOfWater = ctx.inWater ? 0 : state.secondsOutOfWater + ctx.dtSec;
  if (state.secondsOutOfWater >= OUT_OF_WATER_LETHAL_SEC) {
    state.stance = 'dead';
    return;
  }
  if (!ctx.inWater) {
    state.stance = 'suffocating';
    return;
  }
  if (state.fedBy !== null) {
    state.secondsSinceFed += ctx.dtSec;
    if (state.secondsSinceFed >= ESCORT_LIFETIME_SEC) {
      state.fedBy = null;
      state.escortTarget = null;
      state.stance = 'idle';
      return;
    }
    if (ctx.nearestStructure !== null) {
      state.escortTarget = { ...ctx.nearestStructure };
      state.stance = 'escort';
      return;
    }
    state.stance = 'follow';
    return;
  }
  state.stance = ctx.playerNearby ? 'follow' : 'idle';
}

export function feedDolphin(state: DolphinState, playerId: string): boolean {
  if (state.stance === 'dead') return false;
  state.fedBy = playerId;
  state.secondsSinceFed = 0;
  return true;
}

// Applies Dolphin's Grace to nearby swimming players.
// Wiki (minecraft.wiki/w/Dolphin's_Grace): "The player must sprint-
// swim within 9 blocks (Euclidean) of a dolphin to achieve this
// effect with it being replenished if the player continues sprint-
// swimming within 15 blocks (Euclidean)." Old constant 10 split the
// difference between trigger (9) and sustain (15) radii. Sibling
// dolphin_boost.ts now exposes both — this function uses the
// trigger radius for the initial-grace check.
export const DOLPHIN_GRACE_RADIUS = 9;

export function playersInGraceRange(
  state: DolphinState,
  players: readonly { id: string; position: Vec3 }[],
): string[] {
  if (state.stance === 'dead' || state.stance === 'suffocating') return [];
  const out: string[] = [];
  for (const p of players) {
    const dx = p.position.x - state.position.x;
    const dy = p.position.y - state.position.y;
    const dz = p.position.z - state.position.z;
    if (Math.hypot(dx, dy, dz) <= DOLPHIN_GRACE_RADIUS) out.push(p.id);
  }
  return out;
}
