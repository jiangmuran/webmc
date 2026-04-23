export interface WarpedCtx {
  isWarpedBiome: boolean;
  isCrimsonBiome: boolean;
  rng: () => number;
}

export function placementsPerChunk(c: WarpedCtx): string[] {
  if (!c.isWarpedBiome && !c.isCrimsonBiome) return [];
  const base = c.isWarpedBiome
    ? ['warped_nylium', 'warped_fungus', 'warped_roots', 'twisting_vines']
    : ['crimson_nylium', 'crimson_fungus', 'crimson_roots', 'weeping_vines'];
  if (c.rng() < 0.1) base.push(c.isWarpedBiome ? 'nether_sprouts' : 'shroomlight');
  return base;
}

export function ambientSoundId(c: WarpedCtx): string | undefined {
  if (c.isWarpedBiome) return 'music.warped_forest';
  if (c.isCrimsonBiome) return 'music.crimson_forest';
  return undefined;
}
