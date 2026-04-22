// Mending enchant. When the player picks up XP orbs, 50% of the orb's
// XP (2 per point) goes to repairing a damaged mending-enchanted item
// instead of the player's XP bar. Rotates through armor/mainhand/offhand.

import type { Enchanted } from './enchantment';
import { hasEnchant } from './enchantment';

export interface MendingCarrier {
  stack: Enchanted;
  maxDurability: number;
}

const XP_TO_DURABILITY = 2;

// Pick the first mending-enchanted item with damage > 0.
export function pickMendingTarget(items: readonly MendingCarrier[]): MendingCarrier | null {
  for (const item of items) {
    if (hasEnchant(item.stack, 'mending') > 0 && item.stack.damage > 0) return item;
  }
  return null;
}

export interface MendResult {
  repaired: number; // durability restored
  xpConsumed: number; // XP consumed from the orb
  xpLeftover: number; // XP that goes to the player's XP bar
}

export function mendWithXpOrb(target: MendingCarrier | null, xpValue: number): MendResult {
  if (!target || xpValue <= 0) {
    return { repaired: 0, xpConsumed: 0, xpLeftover: xpValue };
  }
  const repairPossible = target.stack.damage;
  const repairFromXp = xpValue * XP_TO_DURABILITY;
  const actualRepair = Math.min(repairPossible, repairFromXp);
  const xpConsumed = Math.ceil(actualRepair / XP_TO_DURABILITY);
  target.stack = { ...target.stack, damage: target.stack.damage - actualRepair };
  return {
    repaired: actualRepair,
    xpConsumed,
    xpLeftover: Math.max(0, xpValue - xpConsumed),
  };
}
