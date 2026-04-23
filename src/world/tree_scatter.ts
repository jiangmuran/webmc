// Tree placement scatter. Deterministic per-chunk random placement
// with density + biome gate.

export interface TreeScatterCtx {
  chunkX: number;
  chunkZ: number;
  seed: number;
  density: number; // trees per chunk
  biomeSupportsTrees: boolean;
}

function hash(seed: number, x: number, z: number, n: number): number {
  let h = seed;
  h = (Math.imul(h ^ x, 2654435761) ^ z) >>> 0;
  h = Math.imul(h ^ n, 40503) >>> 0;
  return (h >>> 0) / 0x100000000;
}

export interface TreeSlot {
  cx: number;
  cz: number;
}

export function scatterTrees(c: TreeScatterCtx): TreeSlot[] {
  if (!c.biomeSupportsTrees) return [];
  const out: TreeSlot[] = [];
  for (let i = 0; i < c.density; i++) {
    const x = Math.floor(hash(c.seed, c.chunkX, c.chunkZ, i) * 16);
    const z = Math.floor(hash(c.seed + 1, c.chunkX, c.chunkZ, i) * 16);
    out.push({ cx: x, cz: z });
  }
  return out;
}

export function densityForBiome(biome: string): number {
  if (biome === 'dark_forest') return 12;
  if (biome === 'forest') return 8;
  if (biome === 'taiga') return 6;
  if (biome === 'plains') return 1;
  if (biome === 'savanna') return 2;
  if (biome === 'jungle') return 16;
  return 0;
}
