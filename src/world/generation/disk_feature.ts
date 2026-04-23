export type DiskBlock = 'sand' | 'red_sand' | 'clay' | 'gravel' | 'mud';

export interface Disk {
  radius: number;
  depth: number;
  block: DiskBlock;
  replaceableBlocks: Set<string>;
}

export function pointInDisk(dx: number, dz: number, d: Disk): boolean {
  return dx * dx + dz * dz <= d.radius * d.radius;
}

export function rollDisk(rng: () => number, block: DiskBlock): Disk {
  const radius = 2 + Math.floor(rng() * 3);
  return {
    radius,
    depth: 1 + Math.floor(rng() * 2),
    block,
    replaceableBlocks: new Set(['dirt', 'grass_block', 'sand', 'clay', 'gravel']),
  };
}
