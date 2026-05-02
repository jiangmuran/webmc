// Bogged (1.21 swamp variant of skeleton). Moss-covered, slower to fire
// than a skeleton but shoots tipped poison arrows at range. Drops a
// mossy-carpet-ish mossy skull item rarely.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface BoggedState {
  id: number;
  position: Vec3;
  health: number;
  drawTicks: number;
  targetId: number | null;
}

export const BOGGED_MAX_HEALTH = 16;
// Wiki (minecraft.wiki/w/Bogged): "The cooldown is 3.5 seconds on
// Easy and Normal difficulties, or 2.5 seconds on Hard. This is 1.5
// seconds slower than the skeleton's attack cooldown." Default to
// Normal (70 ticks); a Hard-difficulty caller can override.
// Old value 30 fired more than 2× the wiki rate (1.5s vs 3.5s).
const DRAW_TICKS_REQUIRED = 70;

export function makeBogged(id: number, at: Vec3): BoggedState {
  return { id, position: { ...at }, health: BOGGED_MAX_HEALTH, drawTicks: 0, targetId: null };
}

export interface BoggedTickCtx {
  hasTarget: boolean;
}

export interface BoggedTickResult {
  fireArrow: boolean;
}

export function tickBogged(state: BoggedState, ctx: BoggedTickCtx): BoggedTickResult {
  if (!ctx.hasTarget) {
    state.drawTicks = 0;
    return { fireArrow: false };
  }
  state.drawTicks++;
  if (state.drawTicks >= DRAW_TICKS_REQUIRED) {
    state.drawTicks = 0;
    return { fireArrow: true };
  }
  return { fireArrow: false };
}

export interface BoggedArrow {
  item: 'webmc:arrow';
  tip: 'poison';
  durationSec: number;
}

// Wiki (minecraft.wiki/w/Bogged): "Arrow of Poison: Poison for 4
// seconds, dealing 3 damage." Old durationSec = 3.75 was a quarter-
// second short of the wiki value.
export function boggedArrow(): BoggedArrow {
  return { item: 'webmc:arrow', tip: 'poison', durationSec: 4 };
}

// Wiki (minecraft.wiki/w/Bogged) drops:
//   Bone:             0-2 (Looting +1)
//   Arrow:            0-2 (Looting +1)
//   Arrow of Poison:  0-1 (Looting +1, only when killed by player/pet)
// Old drop list had a fictitious "bogged_skull" — boggeds do NOT drop
// a head in vanilla; mob heads only drop from charged-creeper kills,
// and the wiki Mob_head page has no entry for Bogged. The Arrow of
// Poison drop was missing entirely.
export function boggedDrops(
  lootingLevel: number,
  killedByPlayerOrPet = false,
  rand: () => number = Math.random,
): { item: string; count: number }[] {
  const drops: { item: string; count: number }[] = [];
  const max = 2 + lootingLevel;
  drops.push({ item: 'webmc:bone', count: Math.floor(rand() * (max + 1)) });
  drops.push({ item: 'webmc:arrow', count: Math.floor(rand() * (max + 1)) });
  if (killedByPlayerOrPet) {
    drops.push({ item: 'webmc:arrow_of_poison', count: rand() < 0.5 ? 1 : 0 });
  }
  return drops.filter((d) => d.count > 0);
}
