// Compass item. Defaults to world spawn. Lodestone compass binds to a
// specific block. Recovery compass points to last death location.

export type CompassKind = 'regular' | 'lodestone' | 'recovery';

export interface Compass {
  kind: CompassKind;
  target: { dim: string; x: number; y: number; z: number } | null;
}

export interface BearingQuery {
  playerPos: { x: number; y: number; z: number };
  playerDim: string;
  worldSpawn: { x: number; y: number; z: number };
  lastDeathPos: { dim: string; x: number; y: number; z: number } | null;
}

// Returns angle in radians from +Z (north), or null if no valid target
// (the compass spins).
//
// Wiki (minecraft.wiki/w/Compass): "A compass points to the world spawn
// point. In the Nether and the End it spins randomly because there is
// no world spawn in those dimensions."
//
// Old `regular` branch returned a coherent bearing toward overworld
// spawn coords regardless of the player's dimension — a regular
// compass in the Nether pointed at the (overworld-mapped) spawn x/z
// instead of spinning. Sibling compass_needle.ts already encodes
// `spinsInDimension(dim) = dim !== 'overworld'`.
export function bearing(c: Compass, q: BearingQuery): number | null {
  let target: { dim: string; x: number; z: number } | null = null;
  if (c.kind === 'lodestone') {
    if (c.target?.dim === q.playerDim) {
      target = c.target;
    } else {
      return null; // spin if lodestone broken or wrong dim
    }
  } else if (c.kind === 'recovery') {
    if (q.lastDeathPos?.dim === q.playerDim) {
      target = q.lastDeathPos;
    } else {
      return null;
    }
  } else {
    if (q.playerDim !== 'overworld') return null;
    target = { dim: q.playerDim, x: q.worldSpawn.x, z: q.worldSpawn.z };
  }
  const dx = target.x - q.playerPos.x;
  const dz = target.z - q.playerPos.z;
  return Math.atan2(dx, dz);
}

export function setLodestone(
  c: Compass,
  pos: { dim: string; x: number; y: number; z: number },
): void {
  c.kind = 'lodestone';
  c.target = pos;
}
