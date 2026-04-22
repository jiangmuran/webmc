// Crossbow. Charged over 1.25s while holding right-click, then fires all
// stored projectiles on release. Multishot enchantment loads 3 arrows for
// the price of 1; Piercing enchant lets arrows punch through entities.

import type { Enchanted } from './enchantment';
import { hasEnchant } from './enchantment';

export interface CrossbowState {
  chargeSec: number; // how long right-click has been held
  loaded: { itemName: string; count: number }[]; // projectiles stored
}

const FULL_CHARGE_SEC = 1.25;
const QUICK_CHARGE_PER_LEVEL = 0.25;

export function makeCrossbow(): CrossbowState {
  return { chargeSec: 0, loaded: [] };
}

export function requiredChargeSec(enchants: Enchanted): number {
  const qc = hasEnchant(enchants, 'quick_charge');
  return Math.max(0.25, FULL_CHARGE_SEC - qc * QUICK_CHARGE_PER_LEVEL);
}

export interface ChargeTick {
  charging: boolean;
  haveProjectile: boolean;
  enchants: Enchanted;
}

export interface ChargeResult {
  fullyCharged: boolean;
  loadedCount: number;
}

export function tickCharge(state: CrossbowState, dtSec: number, ctx: ChargeTick): ChargeResult {
  if (!ctx.charging) {
    state.chargeSec = 0;
    return { fullyCharged: false, loadedCount: state.loaded.length };
  }
  if (state.loaded.length > 0) {
    return { fullyCharged: true, loadedCount: state.loaded.length };
  }
  state.chargeSec += dtSec;
  if (state.chargeSec < requiredChargeSec(ctx.enchants)) {
    return { fullyCharged: false, loadedCount: 0 };
  }
  if (!ctx.haveProjectile) return { fullyCharged: false, loadedCount: 0 };
  const multishot = hasEnchant(ctx.enchants, 'multishot') > 0;
  state.loaded.push({ itemName: 'webmc:arrow', count: multishot ? 3 : 1 });
  state.chargeSec = 0;
  return { fullyCharged: true, loadedCount: state.loaded.length };
}

export interface FireResult {
  shots: readonly { itemName: string; pierce: number; yawOffset: number }[];
}

export function fireCrossbow(state: CrossbowState, enchants: Enchanted): FireResult {
  const pierce = hasEnchant(enchants, 'piercing');
  const shots: { itemName: string; pierce: number; yawOffset: number }[] = [];
  for (const entry of state.loaded) {
    for (let i = 0; i < entry.count; i++) {
      const yawOffset = entry.count === 3 ? ([-10, 0, 10][i] ?? 0) : 0;
      shots.push({ itemName: entry.itemName, pierce, yawOffset });
    }
  }
  state.loaded = [];
  state.chargeSec = 0;
  return { shots };
}

export function isLoaded(state: CrossbowState): boolean {
  return state.loaded.length > 0;
}
