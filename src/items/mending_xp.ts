// Mending. XP picked up while a mending-enchanted item is held or worn
// repairs that item at 2 durability per XP point instead of adding to
// the player's experience bar. If multiple mending items are held, one
// is picked at random per orb.

export interface MendingItem {
  id: number;
  name: string;
  currentDurability: number;
  maxDurability: number;
  hasMending: boolean;
}

export interface MendingContext {
  heldMending: readonly MendingItem[]; // mainhand, offhand, and worn armor that has mending
  xpValue: number;
  rng: () => number;
}

export interface MendingResult {
  repairedItemId: number | null;
  durabilityRestored: number;
  xpSpent: number;
  xpOverflowToPlayer: number;
}

const DURABILITY_PER_XP = 2;

export function applyMendingOnOrb(ctx: MendingContext): MendingResult {
  const damaged = ctx.heldMending.filter(
    (i) => i.hasMending && i.currentDurability < i.maxDurability,
  );
  if (damaged.length === 0) {
    return {
      repairedItemId: null,
      durabilityRestored: 0,
      xpSpent: 0,
      xpOverflowToPlayer: ctx.xpValue,
    };
  }
  const pick = damaged[Math.floor(ctx.rng() * damaged.length)];
  if (!pick) {
    return {
      repairedItemId: null,
      durabilityRestored: 0,
      xpSpent: 0,
      xpOverflowToPlayer: ctx.xpValue,
    };
  }
  const needed = pick.maxDurability - pick.currentDurability;
  const possible = ctx.xpValue * DURABILITY_PER_XP;
  const repair = Math.min(needed, possible);
  const xpConsumed = Math.ceil(repair / DURABILITY_PER_XP);
  pick.currentDurability += repair;
  return {
    repairedItemId: pick.id,
    durabilityRestored: repair,
    xpSpent: xpConsumed,
    xpOverflowToPlayer: ctx.xpValue - xpConsumed,
  };
}

// Experience-per-xp calculation helper.
export function repairFor(xp: number): number {
  return xp * DURABILITY_PER_XP;
}
