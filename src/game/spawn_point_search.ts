export interface SpawnSearchInput {
  centerX: number;
  centerZ: number;
  radius: number;
  isSuitable: (x: number, z: number) => boolean;
  rng: () => number;
}

export function findSpawnPoint(i: SpawnSearchInput): { x: number; z: number } | undefined {
  const tries = 64;
  for (let t = 0; t < tries; t++) {
    const dx = Math.floor((i.rng() - 0.5) * 2 * i.radius);
    const dz = Math.floor((i.rng() - 0.5) * 2 * i.radius);
    const x = i.centerX + dx;
    const z = i.centerZ + dz;
    if (i.isSuitable(x, z)) return { x, z };
  }
  return undefined;
}
