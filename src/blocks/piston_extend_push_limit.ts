export const MAX_PUSH_BLOCKS = 12;
// Wiki (minecraft.wiki/w/Piston#Behavior): non-movable blocks. Anvil
// and beacon are MOVABLE per wiki — anvils are falling blocks,
// beacons are tile-entity blocks listed in the movable category.
// Added the canonical admin/portal/spawner exclusions that were
// missing.
export const IMMOVABLE = new Set([
  'obsidian',
  'crying_obsidian',
  'bedrock',
  'barrier',
  'end_portal_frame',
  'end_portal',
  'end_gateway',
  'piston',
  'sticky_piston',
  'respawn_anchor',
  'reinforced_deepslate',
  'spawner',
  'command_block',
  'chain_command_block',
  'repeating_command_block',
  'structure_block',
  'jigsaw',
]);

export function isImmovable(block: string): boolean {
  return IMMOVABLE.has(block) || block.endsWith('_furnace');
}

export function canPush(chain: string[]): boolean {
  if (chain.length > MAX_PUSH_BLOCKS) return false;
  return !chain.some((b) => isImmovable(b));
}
