// Zombie item pickup + equip. Zombies pick up items within 1.5 blocks;
// they equip armor in the correct slot, replacing weaker items, and
// wield weapons. Equipped items drop on death with drop_chance.

import { willPickup, type PickupCategory } from './zombie_reinforcement';

export type EquipSlot = 'mainhand' | 'helmet' | 'chest' | 'legs' | 'boots';

export interface ZombieEquipment {
  mainhand: string | null;
  helmet: string | null;
  chest: string | null;
  legs: string | null;
  boots: string | null;
  // dropChance per slot: naturally-spawned = 0.085, picked up = 1.0
  dropChance: Record<EquipSlot, number>;
}

export function makeEquipment(): ZombieEquipment {
  return {
    mainhand: null,
    helmet: null,
    chest: null,
    legs: null,
    boots: null,
    dropChance: {
      mainhand: 0.085,
      helmet: 0.085,
      chest: 0.085,
      legs: 0.085,
      boots: 0.085,
    },
  };
}

export interface PickupCandidate {
  item: string;
  category: PickupCategory;
  tier: number; // higher = better; for sorting vs currently-equipped
  slot: EquipSlot;
}

export interface PickupAttempt {
  equipment: ZombieEquipment;
  candidate: PickupCandidate;
  roll: number;
}

export interface PickupOutcome {
  picked: boolean;
  replacedItem: string | null;
}

// Tier comparison helper: higher beats lower; ties don't replace.
function currentTier(item: string | null): number {
  if (!item) return -1;
  if (item.includes('netherite')) return 5;
  if (item.includes('diamond')) return 4;
  if (item.includes('iron')) return 3;
  if (item.includes('gold')) return 2;
  if (item.includes('stone')) return 2;
  if (item.includes('leather') || item.includes('wood') || item.includes('chain')) return 1;
  return 0;
}

export function tryPickup(attempt: PickupAttempt): PickupOutcome {
  const { equipment, candidate, roll } = attempt;
  if (!willPickup(candidate.category, roll)) return { picked: false, replacedItem: null };
  const current = equipment[candidate.slot];
  if (candidate.tier <= currentTier(current)) {
    return { picked: false, replacedItem: null };
  }
  equipment[candidate.slot] = candidate.item;
  equipment.dropChance[candidate.slot] = 1.0; // picked-up items always drop
  return { picked: true, replacedItem: current };
}

// Drop-on-death: iterate slots and drop each one with its dropChance.
export function computeDrops(equipment: ZombieEquipment, rng: () => number): string[] {
  const slots: EquipSlot[] = ['mainhand', 'helmet', 'chest', 'legs', 'boots'];
  const out: string[] = [];
  for (const s of slots) {
    const item = equipment[s];
    if (!item) continue;
    if (rng() < equipment.dropChance[s]) out.push(item);
  }
  return out;
}
