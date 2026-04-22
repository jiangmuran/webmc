// End stone islands. The main island is a large flat-topped mass.
// Outer islands (beyond ring radius 1000) are smaller floating pods.

export interface IslandQuery {
  x: number;
  z: number;
  worldSeed: bigint;
}

export const MAIN_ISLAND_RADIUS = 50;
export const OUTER_START_RADIUS = 1000;

export function isMainIsland(q: IslandQuery): boolean {
  return q.x * q.x + q.z * q.z <= MAIN_ISLAND_RADIUS * MAIN_ISLAND_RADIUS;
}

export function isOuterIslandRegion(q: IslandQuery): boolean {
  const d2 = q.x * q.x + q.z * q.z;
  return d2 > OUTER_START_RADIUS * OUTER_START_RADIUS;
}

// Simple deterministic height: sinusoidal drop-off from center on
// main island, sparse floating platforms outside.
export function islandHeight(q: IslandQuery): number | null {
  if (isMainIsland(q)) {
    const d = Math.sqrt(q.x * q.x + q.z * q.z);
    const falloff = 1 - Math.min(1, d / MAIN_ISLAND_RADIUS);
    return Math.round(40 + falloff * 20);
  }
  if (!isOuterIslandRegion(q)) return null; // between main and outer = empty
  // pseudo-noise for outer: hash coord
  const h = hashCoord(q.x, q.z, q.worldSeed);
  if ((h & 0x3ff) < 0x30) {
    return 40 + (h & 0x1f);
  }
  return null;
}

function hashCoord(x: number, z: number, seed: bigint): number {
  let n = BigInt(x) * 0x1f1f1f1fn + BigInt(z) * 0x6c078965n + seed;
  n ^= n >> 13n;
  n = (n * 0x5bd1e995n) & 0xffffffffn;
  return Number(n & 0xffffffffn);
}

// Obsidian pillars on main island: 10 pillars placed in a circle.
export const PILLAR_COUNT = 10;
export const PILLAR_CIRCLE_RADIUS = 42;

export function pillarPositions(): { x: number; z: number; height: number }[] {
  const out: { x: number; z: number; height: number }[] = [];
  for (let i = 0; i < PILLAR_COUNT; i++) {
    const angle = (i / PILLAR_COUNT) * Math.PI * 2;
    out.push({
      x: Math.round(Math.cos(angle) * PILLAR_CIRCLE_RADIUS),
      z: Math.round(Math.sin(angle) * PILLAR_CIRCLE_RADIUS),
      height: 76 + (i % 4) * 4,
    });
  }
  return out;
}
