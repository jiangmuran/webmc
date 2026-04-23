// Stronghold locations: 3 concentric rings around origin, 8 per first
// ring. Eye of Ender points to nearest.

export const STRONGHOLD_RING_DISTANCES = [1408, 2688, 3968, 5248, 6528, 7808, 9088, 10368];
export const STRONGHOLDS_PER_RING = [3, 6, 10, 15, 21, 28, 36, 9];

export function strongholdsInFirstRing(): number {
  return STRONGHOLDS_PER_RING[0] ?? 3;
}

export function generateStrongholdPositions(
  seed: number,
  ring: number,
): { x: number; z: number }[] {
  const count = STRONGHOLDS_PER_RING[ring] ?? 0;
  const radius = STRONGHOLD_RING_DISTANCES[ring] ?? 0;
  const out: { x: number; z: number }[] = [];
  const offset = ((seed & 0xffff) / 0x10000) * 2 * Math.PI;
  for (let i = 0; i < count; i++) {
    const angle = offset + (i / count) * 2 * Math.PI;
    out.push({ x: Math.round(Math.cos(angle) * radius), z: Math.round(Math.sin(angle) * radius) });
  }
  return out;
}

export function distanceToNearest(
  positions: { x: number; z: number }[],
  px: number,
  pz: number,
): number {
  let best = Infinity;
  for (const p of positions) best = Math.min(best, Math.hypot(p.x - px, p.z - pz));
  return best;
}
