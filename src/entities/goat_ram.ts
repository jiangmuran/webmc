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

// Wiki (minecraft.wiki/w/Goat): "Normal goats ram every 30 s to 5 min;
// screaming goats ram every 1.5 s to 7.5 s." Old SCREAMING bounds
// were 7-60 s, ~9× slower than the wiki's annoying-screaming-goat
// rate. Sibling goat_ram_charge.ts already implements the 1.5-7.5 s
// range via a 0.03× multiplier.
const NORMAL_COOLDOWN_MIN = 30;
const NORMAL_COOLDOWN_MAX = 300;
const SCREAMING_COOLDOWN_MIN = 1.5;
const SCREAMING_COOLDOWN_MAX = 7.5;

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
