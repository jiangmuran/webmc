// Frost Walker — boots enchant that freezes water blocks into frosted_ice
// under the player's feet in a radius of (level + 1) blocks. Frosted ice
// decays after ~3-4s if not standing on it.

import type { Enchanted } from './enchantment';
import { hasEnchant } from './enchantment';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface FrostWalkerLookup {
  isWaterSource(x: number, y: number, z: number): boolean;
}

// Returns positions to replace with frosted_ice. Excludes positions that
// are not water sources.
export function frostWalkerStep(
  boots: Enchanted,
  playerPos: Vec3,
  lookup: FrostWalkerLookup,
): readonly Vec3[] {
  const level = hasEnchant(boots, 'frost_walker');
  if (level <= 0) return [];
  const radius = level + 1;
  const footY = Math.floor(playerPos.y - 0.01);
  const frozen: Vec3[] = [];
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      if (dx * dx + dz * dz > radius * radius) continue;
      const x = Math.floor(playerPos.x + dx);
      const z = Math.floor(playerPos.z + dz);
      if (lookup.isWaterSource(x, footY, z)) {
        frozen.push({ x, y: footY, z });
      }
    }
  }
  return frozen;
}

// Frosted-ice decay — 3-4 seconds then reverts to water. Caller tracks
// timers per-block.
const FROSTED_ICE_DECAY_SEC = 3.5;

export function frostedIceDecayTime(): number {
  return FROSTED_ICE_DECAY_SEC;
}
