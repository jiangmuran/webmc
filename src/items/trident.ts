// Trident + Riptide. When thrown the trident behaves like an arrow but
// heavier. With Riptide in rain/water, the player is launched in look
// direction as a "ride-along" the trident.

import type { Enchanted } from './enchantment';
import { hasEnchant } from './enchantment';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface RiptideQuery {
  trident: Enchanted;
  inWater: boolean;
  inRain: boolean;
  lookDirection: Vec3;
  chargeSec: number; // 0 .. 2+ (how long the throw was charged)
}

export interface RiptideResult {
  canLaunch: boolean;
  launchVelocity: Vec3; // zeroed if !canLaunch
}

// Wiki (minecraft.wiki/w/Riptide): "The formula for the number of
// blocks the trident throws the user is (6 × level) + 3 when in rain
// or standing in water." → magnitude (blocks/sec) = 6×level + 3:
// level I = 9, II = 15, III = 21. Old `3 + 1.75 * level` gave
// 4.75/6.5/8.25 — about 40% of the wiki magnitude. Sibling
// riptide_trident.launchVelocityBps already returns the wiki value;
// this module now matches.
export function computeRiptide(q: RiptideQuery): RiptideResult {
  const level = hasEnchant(q.trident, 'riptide');
  if (level <= 0) return { canLaunch: false, launchVelocity: { x: 0, y: 0, z: 0 } };
  if (!q.inWater && !q.inRain) {
    return { canLaunch: false, launchVelocity: { x: 0, y: 0, z: 0 } };
  }
  if (q.chargeSec < 0.5) return { canLaunch: false, launchVelocity: { x: 0, y: 0, z: 0 } };
  const magnitude = 6 * level + 3;
  return {
    canLaunch: true,
    launchVelocity: {
      x: q.lookDirection.x * magnitude,
      y: q.lookDirection.y * magnitude,
      z: q.lookDirection.z * magnitude,
    },
  };
}

// Loyalty pulls the trident back to the owner each tick when it's stuck.
export interface LoyaltyQuery {
  trident: Enchanted;
  stuck: boolean;
  tridentPos: Vec3;
  ownerPos: Vec3;
}

export function tickLoyalty(q: LoyaltyQuery, dtSec: number): Vec3 {
  const level = hasEnchant(q.trident, 'loyalty');
  if (level <= 0 || !q.stuck) return { x: 0, y: 0, z: 0 };
  const dx = q.ownerPos.x - q.tridentPos.x;
  const dy = q.ownerPos.y - q.tridentPos.y;
  const dz = q.ownerPos.z - q.tridentPos.z;
  const dist = Math.hypot(dx, dy, dz) || 1;
  const speed = level * 1.5;
  return {
    x: (dx / dist) * speed * dtSec,
    y: (dy / dist) * speed * dtSec,
    z: (dz / dist) * speed * dtSec,
  };
}
