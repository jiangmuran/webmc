// Evoker fangs spell. An Evoker summons a line of 16 fangs toward
// the target; each fang strikes after a per-fang warmup, dealing
// 6 HP on whatever entity is standing over it (ignores armor).
//
// Wiki (minecraft.wiki/w/Evoker#Fang_attack): "The evoker typically
// summons sixteen fangs in a straight line toward the target."
// Old code summoned only 8 — half the wiki count, halving the
// total damage potential of a fang line attack.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface FangState {
  position: Vec3;
  warmupSec: number; // time until strike
  struck: boolean;
  ownerId: number;
}

const WARMUP_BASE = 0.05;

// Summon 8 fangs in a straight line along the direction vector.
export function summonFangLine(
  origin: Vec3,
  direction: { x: number; z: number },
  ownerId: number,
): readonly FangState[] {
  const fangs: FangState[] = [];
  const dx = direction.x;
  const dz = direction.z;
  const norm = Math.hypot(dx, dz) || 1;
  for (let step = 1; step <= FANG_LINE_COUNT; step++) {
    fangs.push({
      position: {
        x: Math.floor(origin.x + (dx / norm) * step),
        y: origin.y,
        z: Math.floor(origin.z + (dz / norm) * step),
      },
      warmupSec: step * WARMUP_BASE,
      struck: false,
      ownerId,
    });
  }
  return fangs;
}

export interface FangTickCtx {
  dtSec: number;
  entityOnFang: number | null;
}

export interface FangStrike {
  strike: boolean;
  targetEntity: number | null;
}

export function tickFang(state: FangState, ctx: FangTickCtx): FangStrike {
  if (state.struck) return { strike: false, targetEntity: null };
  state.warmupSec = Math.max(0, state.warmupSec - ctx.dtSec);
  if (state.warmupSec > 0) return { strike: false, targetEntity: null };
  state.struck = true;
  return { strike: true, targetEntity: ctx.entityOnFang };
}

export const FANG_DAMAGE = 6;
export const FANG_LINE_COUNT = 16;
