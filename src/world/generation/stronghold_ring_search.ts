export const RING_COUNT = 8;
export const RING_DISTANCES: readonly (readonly [number, number])[] = [
  [1408, 2688],
  [4480, 5760],
  [7552, 8832],
  [10624, 11904],
  [13696, 14976],
  [16768, 18048],
  [19840, 21120],
  [22912, 24192],
];
export const STRONGHOLDS_PER_RING = [3, 6, 10, 15, 21, 28, 36, 9];

export function ringIndexForDistance(d: number): number | undefined {
  for (let i = 0; i < RING_DISTANCES.length; i++) {
    const [lo, hi] = RING_DISTANCES[i] ?? [0, 0];
    if (d >= lo && d <= hi) return i;
  }
  return undefined;
}

export function totalStrongholds(): number {
  return STRONGHOLDS_PER_RING.reduce((s, v) => s + v, 0);
}

export function strongholdsInRing(i: number): number {
  return STRONGHOLDS_PER_RING[i] ?? 0;
}

export function nearestRingAngle(
  n: number,
  worldSeed: number,
): readonly { angle: number; radius: number }[] {
  const count = strongholdsInRing(n);
  const ring = RING_DISTANCES[n];
  if (ring === undefined) return [];
  const mid = (ring[0] + ring[1]) / 2;
  const base = (worldSeed % 628) / 100;
  const out: { angle: number; radius: number }[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      angle: base + (i * 2 * Math.PI) / count,
      radius: mid,
    });
  }
  return out;
}
