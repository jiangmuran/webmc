// Pathfinding water avoidance. Most passive/land mobs prefer not to
// enter water (path cost penalty × 4). Aquatic mobs (dolphins, fish)
// invert the penalty. This module exposes the per-node cost adjustment
// used by A* pathfinding.

export type MobLocomotion = 'land' | 'amphibious' | 'aquatic' | 'flying';

export interface TerrainNode {
  isWater: boolean;
  isLava: boolean;
  isAir: boolean;
  isFire: boolean;
  baseCost: number;
}

const WATER_PENALTY = 4;
const LAVA_PENALTY = 8;
const FIRE_PENALTY = 16;

export function pathCost(node: TerrainNode, locomotion: MobLocomotion): number {
  let cost = node.baseCost;
  if (node.isLava && locomotion !== 'aquatic') cost *= LAVA_PENALTY;
  if (node.isFire) cost *= FIRE_PENALTY;
  switch (locomotion) {
    case 'land':
      if (node.isWater) cost *= WATER_PENALTY;
      break;
    case 'amphibious':
      // no penalty; neutral
      break;
    case 'aquatic':
      if (!node.isWater && !node.isLava) cost *= WATER_PENALTY; // prefer water
      break;
    case 'flying':
      if (node.isWater) cost *= 2;
      break;
  }
  return cost;
}

// Whether a mob can enter a node at all.
export function canTraverse(node: TerrainNode, locomotion: MobLocomotion): boolean {
  if (locomotion === 'aquatic' && !node.isWater) return false;
  if (node.isLava && locomotion !== 'aquatic') return false;
  return true;
}

// Typical locomotion per mob kind.
const LOCOMOTION: Record<string, MobLocomotion> = {
  zombie: 'land',
  skeleton: 'land',
  creeper: 'land',
  cow: 'land',
  pig: 'land',
  sheep: 'land',
  chicken: 'land',
  wolf: 'land',
  cat: 'land',
  fox: 'land',
  horse: 'land',
  frog: 'amphibious',
  turtle: 'amphibious',
  drowned: 'amphibious',
  guardian: 'aquatic',
  elder_guardian: 'aquatic',
  dolphin: 'aquatic',
  squid: 'aquatic',
  cod: 'aquatic',
  salmon: 'aquatic',
  pufferfish: 'aquatic',
  tropical_fish: 'aquatic',
  axolotl: 'amphibious',
  phantom: 'flying',
  ghast: 'flying',
  blaze: 'flying',
  vex: 'flying',
  bee: 'flying',
  allay: 'flying',
};

export function locomotionFor(mob: string): MobLocomotion {
  return LOCOMOTION[mob] ?? 'land';
}
