// Goat ram attack. Goats periodically ram nearby entities for 1-3 damage
// + knockback. A "screaming" goat variant rams 5x more often and drops a
// unique goat horn when ramming into a stone block.

export interface GoatRamState {
  isScreaming: boolean;
  ramCooldownSec: number;
}

export function makeGoatRam(screaming = false): GoatRamState {
  return { isScreaming: screaming, ramCooldownSec: 0 };
}

// Wiki (minecraft.wiki/w/Goat#Ramming): "Every 30 seconds to 5 minutes,
// a goat tries to ram a single unmoving target ... A screaming goat
// tries to ram a valid target every 5 to 15 seconds."
//
// A previous "fix" recorded 1.5–7.5 s for screaming goats — that's
// 3.3× too aggressive at the lower bound. Wiki-canonical screaming
// rate is 5–15 s. Sibling goat_ram_charge.ts had the same wrong
// bounds; both modules now match wiki.
const NORMAL_COOLDOWN_MIN = 30;
const NORMAL_COOLDOWN_MAX = 300;
const SCREAMING_COOLDOWN_MIN = 5;
const SCREAMING_COOLDOWN_MAX = 15;

export interface RamTickCtx {
  dtSec: number;
  hasRamTarget: boolean;
  rng: () => number;
}

export interface RamResult {
  ram: boolean;
  damage: number;
}

export function tickGoatRam(state: GoatRamState, ctx: RamTickCtx): RamResult {
  state.ramCooldownSec = Math.max(0, state.ramCooldownSec - ctx.dtSec);
  if (state.ramCooldownSec > 0 || !ctx.hasRamTarget) {
    return { ram: false, damage: 0 };
  }
  const [min, max] = state.isScreaming
    ? [SCREAMING_COOLDOWN_MIN, SCREAMING_COOLDOWN_MAX]
    : [NORMAL_COOLDOWN_MIN, NORMAL_COOLDOWN_MAX];
  state.ramCooldownSec = min + ctx.rng() * (max - min);
  const damage = state.isScreaming ? 3 : 1 + Math.floor(ctx.rng() * 3);
  return { ram: true, damage };
}

// Ramming into a block has a chance to drop a horn.
export interface HornDropQuery {
  blockHardness: number;
  isScreaming: boolean;
  rng: () => number;
}

export function maybeDropHorn(q: HornDropQuery): string | null {
  if (!q.isScreaming) return null;
  if (q.blockHardness < 1) return null; // too soft
  if (q.rng() < 0.5) return 'webmc:goat_horn';
  return null;
}
