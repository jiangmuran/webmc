// XP orb pickup. Orbs gravitate toward nearby player; on contact add
// XP. Mending enchantment on held/worn item consumes nearby XP to
// repair durability first.

export interface XpOrb {
  id: number;
  x: number;
  y: number;
  z: number;
  value: number;
  lifetimeTicks: number;
}

// Wiki (minecraft.wiki/w/Experience): "Experience orbs ... float or
// glide toward the player up to a distance of 7.25 blocks." Old
// GRAVITATE_RADIUS = 8 was 0.75 blocks over wiki canon, so orbs in
// the 7.25-8 shell would attract players that wiki canon leaves
// untouched. Sibling xp_orb.ts MAGNET_RADIUS now uses 7.25; this
// module matches.
export const GRAVITATE_RADIUS = 7.25;
export const PICKUP_RADIUS = 1.1;
export const LIFETIME_TICKS = 6000; // 5 min

export interface TickQuery {
  player: { x: number; y: number; z: number } | null;
  nowTick: number;
}

export function orbInGravitateRange(o: XpOrb, q: TickQuery): boolean {
  if (!q.player) return false;
  const dx = o.x - q.player.x;
  const dy = o.y - q.player.y;
  const dz = o.z - q.player.z;
  return dx * dx + dy * dy + dz * dz <= GRAVITATE_RADIUS * GRAVITATE_RADIUS;
}

export function orbInPickupRange(o: XpOrb, q: TickQuery): boolean {
  if (!q.player) return false;
  const dx = o.x - q.player.x;
  const dy = o.y - q.player.y;
  const dz = o.z - q.player.z;
  return dx * dx + dy * dy + dz * dz <= PICKUP_RADIUS * PICKUP_RADIUS;
}

// Mending repair ratio: 2 durability per XP consumed.
export const MENDING_RATIO = 2;

export interface MendingQuery {
  orbValue: number;
  itemDamage: number;
}

export interface MendingResult {
  durabilityRepaired: number;
  xpConsumed: number;
  xpRemaining: number;
}

export function applyMending(q: MendingQuery): MendingResult {
  if (q.itemDamage <= 0) {
    return { durabilityRepaired: 0, xpConsumed: 0, xpRemaining: q.orbValue };
  }
  const maxRepair = Math.min(q.itemDamage, q.orbValue * MENDING_RATIO);
  const xpConsumed = Math.ceil(maxRepair / MENDING_RATIO);
  return {
    durabilityRepaired: maxRepair,
    xpConsumed,
    xpRemaining: q.orbValue - xpConsumed,
  };
}
