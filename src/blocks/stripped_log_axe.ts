// Axe "strip" interaction: right-click a log with an axe strips it.
// Works for wood and hyphae. Copper + axe: de-oxidize / de-wax.

const STRIP_TABLE: Record<string, string> = {
  'webmc:oak_log': 'webmc:stripped_oak_log',
  'webmc:spruce_log': 'webmc:stripped_spruce_log',
  'webmc:birch_log': 'webmc:stripped_birch_log',
  'webmc:jungle_log': 'webmc:stripped_jungle_log',
  'webmc:acacia_log': 'webmc:stripped_acacia_log',
  'webmc:dark_oak_log': 'webmc:stripped_dark_oak_log',
  'webmc:mangrove_log': 'webmc:stripped_mangrove_log',
  'webmc:cherry_log': 'webmc:stripped_cherry_log',
  'webmc:oak_wood': 'webmc:stripped_oak_wood',
  'webmc:crimson_stem': 'webmc:stripped_crimson_stem',
  'webmc:warped_stem': 'webmc:stripped_warped_stem',
  'webmc:bamboo_block': 'webmc:stripped_bamboo_block',
};

export function strippedFor(blockId: string): string | null {
  return STRIP_TABLE[blockId] ?? null;
}

// Pumpkin carve: axe right-click an uncarved pumpkin → carved + drops 4 pumpkin seeds.
export function carvePumpkin(
  blockId: string,
): { carved: string; drops: { id: string; count: number } } | null {
  if (blockId !== 'webmc:pumpkin') return null;
  return {
    carved: 'webmc:carved_pumpkin',
    drops: { id: 'webmc:pumpkin_seeds', count: 4 },
  };
}
