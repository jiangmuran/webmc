// Enderman teleport. On damage or when stuck in water/rain, teleport
// to a random block up to ±32 blocks on each axis. Must land on a
// solid block with 2 blocks of clearance above. Wiki
// (minecraft.wiki/w/Enderman): "16 random teleport attempts before
// failing."
//
// Old `floor((rand-0.5) * 2 * 32)` gave the asymmetric range
// [-32, +31] — floor of a pre-shifted negative range silently drops
// the +32 endpoint. Same off-by-one already fixed in chorus_fruit
// teleport and dragon_egg_hop. Now uses an inclusive offset helper.

export interface TeleportQuery {
  from: { x: number; y: number; z: number };
  rand: () => number;
  validLanding: (x: number, y: number, z: number) => boolean;
  maxAttempts?: number;
}

export const TP_RADIUS = 32;

function offsetInclusive(rand: () => number): number {
  return Math.floor(rand() * (2 * TP_RADIUS + 1)) - TP_RADIUS;
}

export function tryTeleport(q: TeleportQuery): { x: number; y: number; z: number } | null {
  const attempts = q.maxAttempts ?? 16;
  for (let i = 0; i < attempts; i++) {
    const dx = offsetInclusive(q.rand);
    const dy = offsetInclusive(q.rand);
    const dz = offsetInclusive(q.rand);
    const x = q.from.x + dx;
    const y = q.from.y + dy;
    const z = q.from.z + dz;
    if (q.validLanding(x, y, z)) return { x, y, z };
  }
  return null;
}

// Enderman takes damage from water; teleport-from-water triggered once
// per water tick until escape.
export function triggersTeleport(water: boolean, rain: boolean, damaged: boolean): boolean {
  return water || rain || damaged;
}
