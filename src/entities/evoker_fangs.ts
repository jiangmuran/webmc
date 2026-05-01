// Evoker fangs spell. An Evoker summons a line of 16 fangs toward
// the target; each fang has a 1.25-second (25-tick) warmup before
// striking, dealing 6 HP to whatever entity stands over it (ignores
// armor).
//
// Wiki (minecraft.wiki/w/Evoker#Fang_attack):
//   - "The evoker summons sixteen fangs in a straight line toward
//     the target." (line count fixed at 16)
//   - "Each fang individually rises out of the ground, charges for
//     1.25 seconds (25 ticks), then strikes downward dealing 6 HP."
//   - Fangs spawn sequentially along the line so the strikes cascade.
//
// Old WARMUP_BASE = 0.05 s gave fang 1 a 0.05 s strike time and fang
// 16 only 0.8 s — both far below the wiki 1.25 s per-fang charge,
// effectively turning the line into an instant 16-hit ribbon.

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

// Wiki: per-fang charge time is 1.25 s = 25 game ticks.
export const FANG_CHARGE_SEC = 1.25;
// Cascade: each subsequent fang spawns ~2 ticks (0.1 s) after the
// previous, so the line of 16 unfurls over ~1.6 s while each fang
// independently charges its 1.25 s warmup.
const FANG_SPAWN_STAGGER_SEC = 0.1;

// Summon a line of fangs along the direction vector toward the target.
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
      warmupSec: FANG_CHARGE_SEC + (step - 1) * FANG_SPAWN_STAGGER_SEC,
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
