// Explosion resistance table keyed by webmc block id. Higher = harder to
// blow up. Used by `explosion.ts` to decide whether a block in the blast
// radius is destroyed by a given TNT/creeper/wither blast.

const TABLE: Record<string, number> = {
  'webmc:air': 0,
  'webmc:dirt': 0.5,
  'webmc:grass_block': 0.6,
  'webmc:sand': 0.5,
  'webmc:gravel': 0.6,
  'webmc:stone': 6,
  'webmc:cobblestone': 6,
  'webmc:deepslate': 6,
  'webmc:cobbled_deepslate': 6,
  'webmc:iron_block': 6,
  'webmc:gold_block': 6,
  'webmc:diamond_block': 6,
  'webmc:netherite_block': 1200,
  'webmc:obsidian': 1200,
  'webmc:crying_obsidian': 1200,
  'webmc:respawn_anchor': 1200,
  'webmc:ancient_debris': 1200,
  'webmc:reinforced_deepslate': 1200,
  'webmc:bedrock': 3_600_000, // unbreakable-by-explosion
  'webmc:end_portal_frame': 3_600_000,
  'webmc:command_block': 3_600_000,
  'webmc:barrier': 3_600_000,
  'webmc:end_stone': 9,
  'webmc:oak_planks': 3,
  'webmc:oak_log': 2,
  'webmc:tnt': 0,
  'webmc:glass': 0.3,
  'webmc:glowstone': 0.3,
  'webmc:wool_white': 0.8,
  'webmc:ice': 0.5,
};

export function resistanceOf(blockId: string): number {
  return TABLE[blockId] ?? 1.0;
}

// Resistance threshold for a given explosion power — this is the classic
// MC voxel explosion check. `intensity` is the explosion power remaining
// at the block; block is destroyed iff `intensity > resistance + 0.3`.
export function isDestroyedBy(blockId: string, intensity: number): boolean {
  const r = resistanceOf(blockId);
  if (r >= 1_000_000) return false; // bedrock-tier never destroyed
  return intensity > r + 0.3;
}

// Explosion power decays by `(resistance + 0.3) * 0.3` when passing through
// a block along a ray. Used by explosion.ts to propagate damage.
export function intensityAfterBlock(blockId: string, intensity: number): number {
  const r = resistanceOf(blockId);
  return intensity - (r + 0.3) * 0.3;
}

export function registerResistance(blockId: string, resistance: number): void {
  TABLE[blockId] = resistance;
}
