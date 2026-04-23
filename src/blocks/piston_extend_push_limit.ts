export const MAX_PUSH_BLOCKS = 12;
export const IMMOVABLE = new Set([
  'obsidian',
  'crying_obsidian',
  'bedrock',
  'barrier',
  'end_portal_frame',
  'anvil',
  'beacon',
  'piston',
  'sticky_piston',
  'respawn_anchor',
  'reinforced_deepslate',
]);

export function isImmovable(block: string): boolean {
  return IMMOVABLE.has(block) || block.endsWith('_furnace');
}

export function canPush(chain: string[]): boolean {
  if (chain.length > MAX_PUSH_BLOCKS) return false;
  return !chain.some((b) => isImmovable(b));
}
