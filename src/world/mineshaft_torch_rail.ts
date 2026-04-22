// Mineshaft generation. A maze of wooden support tunnels with rails,
// torches, cobwebs, and occasional chest minecarts.

export interface MineshaftSegment {
  kind: 'corridor' | 'staircase' | 'room' | 'intersection';
  orientation: 'x' | 'z';
  x: number;
  y: number;
  z: number;
  length: number;
}

export const CORRIDOR_LEN = 8;
export const MAX_DEPTH = 6;

// Torch density: ~1 per 5 blocks along corridor floor.
export function torchPositions(seg: MineshaftSegment): { x: number; y: number; z: number }[] {
  const out: { x: number; y: number; z: number }[] = [];
  const step = 5;
  for (let i = 2; i < seg.length; i += step) {
    const x = seg.orientation === 'x' ? seg.x + i : seg.x;
    const z = seg.orientation === 'z' ? seg.z + i : seg.z;
    out.push({ x, y: seg.y + 2, z });
  }
  return out;
}

// Cobweb spots: ~8% of tiles.
export const COBWEB_CHANCE = 0.08;

export function isCobweb(rand: () => number): boolean {
  return rand() < COBWEB_CHANCE;
}

// Chest minecart spots: 1/12 corridors.
export const CHEST_MINECART_CHANCE = 1 / 12;

export function spawnsChestMinecart(rand: () => number): boolean {
  return rand() < CHEST_MINECART_CHANCE;
}

// Cave spider spawner chance.
export const CAVE_SPIDER_SPAWNER_CHANCE = 1 / 15;

export function hasCaveSpiderSpawner(rand: () => number): boolean {
  return rand() < CAVE_SPIDER_SPAWNER_CHANCE;
}
