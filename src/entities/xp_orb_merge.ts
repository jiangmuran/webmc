// XP orbs. Dropped on kill or smelt output. Merge with nearby orbs
// to reduce entity count. Pickup range ~1 block; gravitate at ~8.

export interface XpOrb {
  id: number;
  x: number;
  y: number;
  z: number;
  value: number;
  ageTicks: number;
}

export const MERGE_RADIUS = 0.5;
export const PICKUP_RADIUS = 1.0;
export const DESPAWN_TICKS = 6000; // 5 minutes @ 20 Hz

export function canMerge(a: XpOrb, b: XpOrb): boolean {
  if (a.id === b.id) return false;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz <= MERGE_RADIUS * MERGE_RADIUS;
}

export function mergeInto(dest: XpOrb, src: XpOrb): void {
  dest.value += src.value;
  dest.ageTicks = Math.min(dest.ageTicks, src.ageTicks);
}

export function withinPickup(o: XpOrb, px: number, py: number, pz: number): boolean {
  const dx = o.x - px;
  const dy = o.y - py;
  const dz = o.z - pz;
  return dx * dx + dy * dy + dz * dz <= PICKUP_RADIUS * PICKUP_RADIUS;
}

// Split a total XP amount into orbs of varying size (MC-like: largest
// possible orb chunks first — 2477, 1237, 617, 307, 149, 73, 37, 17, 7, 3, 1).
const ORB_CHUNKS = [2477, 1237, 617, 307, 149, 73, 37, 17, 7, 3, 1] as const;

export function splitXp(amount: number): number[] {
  const out: number[] = [];
  let rem = Math.max(0, Math.floor(amount));
  while (rem > 0) {
    const chunk = ORB_CHUNKS.find((c) => c <= rem) ?? 1;
    out.push(chunk);
    rem -= chunk;
  }
  return out;
}
