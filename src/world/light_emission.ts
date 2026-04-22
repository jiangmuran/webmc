// Light emission table per block id (0..15). Used by the BFS lighting pass
// in world/lighting.ts as the seed value for block-light propagation.

const EMISSION: Record<string, number> = {
  'webmc:torch': 14,
  'webmc:wall_torch': 14,
  'webmc:soul_torch': 10,
  'webmc:soul_wall_torch': 10,
  'webmc:redstone_torch': 7,
  'webmc:glowstone': 15,
  'webmc:lava': 15,
  'webmc:jack_o_lantern': 15,
  'webmc:sea_lantern': 15,
  'webmc:end_rod': 14,
  'webmc:beacon': 15,
  'webmc:conduit': 15,
  'webmc:shroomlight': 15,
  'webmc:lantern': 15,
  'webmc:soul_lantern': 10,
  'webmc:soul_fire': 10,
  'webmc:fire': 15,
  'webmc:campfire': 15,
  'webmc:soul_campfire': 10,
  'webmc:magma_block': 3,
  'webmc:crying_obsidian': 10,
  'webmc:ender_chest': 7,
  'webmc:brewing_stand': 1,
  'webmc:blast_furnace': 13, // when lit
  'webmc:smoker': 13, // when lit
  'webmc:furnace': 13, // when lit
  'webmc:redstone_ore': 9, // when active
  'webmc:glow_lichen': 7,
  'webmc:amethyst_cluster': 5,
  'webmc:small_amethyst_bud': 1,
  'webmc:medium_amethyst_bud': 2,
  'webmc:large_amethyst_bud': 4,
  'webmc:pearlescent_froglight': 15,
  'webmc:verdant_froglight': 15,
  'webmc:ochre_froglight': 15,
  'webmc:sculk_catalyst': 6,
  'webmc:respawn_anchor': 15, // when charged
  'webmc:lava_cauldron': 15,
  'webmc:copper_bulb_lit': 15,
  'webmc:exposed_copper_bulb_lit': 12,
  'webmc:weathered_copper_bulb_lit': 8,
  'webmc:oxidized_copper_bulb_lit': 4,
  'webmc:creaking_heart_awake': 4,
};

export function emissionOf(blockId: string): number {
  return EMISSION[blockId] ?? 0;
}

export function isLightSource(blockId: string): boolean {
  return emissionOf(blockId) > 0;
}

export function registerEmission(blockId: string, level: number): void {
  const clamped = Math.max(0, Math.min(15, Math.floor(level)));
  EMISSION[blockId] = clamped;
}

// Sum emission for a column of blocks; useful for tests on stacked lights.
export function totalEmission(blockIds: readonly string[]): number {
  let sum = 0;
  for (const id of blockIds) sum += emissionOf(id);
  return sum;
}
