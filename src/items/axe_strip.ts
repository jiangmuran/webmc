// Axe stripping + scraping. Right-click on oak_log → stripped_oak_log;
// right-click on a waxed copper block → un-waxes; on oxidized copper →
// one oxidation tier younger.

const STRIP_MAP: Record<string, string> = {
  'webmc:oak_log': 'webmc:stripped_oak_log',
  'webmc:spruce_log': 'webmc:stripped_spruce_log',
  'webmc:birch_log': 'webmc:stripped_birch_log',
  'webmc:jungle_log': 'webmc:stripped_jungle_log',
  'webmc:acacia_log': 'webmc:stripped_acacia_log',
  'webmc:dark_oak_log': 'webmc:stripped_dark_oak_log',
  'webmc:mangrove_log': 'webmc:stripped_mangrove_log',
  'webmc:cherry_log': 'webmc:stripped_cherry_log',
  'webmc:crimson_stem': 'webmc:stripped_crimson_stem',
  'webmc:warped_stem': 'webmc:stripped_warped_stem',
  'webmc:bamboo_block': 'webmc:stripped_bamboo_block',
};

const WAXED_UNWAX: Record<string, string> = {
  'webmc:waxed_copper_block': 'webmc:copper_block',
  'webmc:waxed_exposed_copper': 'webmc:exposed_copper',
  'webmc:waxed_weathered_copper': 'webmc:weathered_copper',
  'webmc:waxed_oxidized_copper': 'webmc:oxidized_copper',
  'webmc:waxed_cut_copper': 'webmc:cut_copper',
};

const OXIDIZE_BACK: Record<string, string> = {
  'webmc:oxidized_copper': 'webmc:weathered_copper',
  'webmc:weathered_copper': 'webmc:exposed_copper',
  'webmc:exposed_copper': 'webmc:copper_block',
};

export type AxeResult =
  | { kind: 'strip'; newBlock: string }
  | { kind: 'unwax'; newBlock: string }
  | { kind: 'scrape'; newBlock: string }
  | { kind: 'none' };

export function useAxe(targetBlockName: string): AxeResult {
  if (STRIP_MAP[targetBlockName]) {
    return { kind: 'strip', newBlock: STRIP_MAP[targetBlockName] };
  }
  if (WAXED_UNWAX[targetBlockName]) {
    return { kind: 'unwax', newBlock: WAXED_UNWAX[targetBlockName] };
  }
  if (OXIDIZE_BACK[targetBlockName]) {
    return { kind: 'scrape', newBlock: OXIDIZE_BACK[targetBlockName] };
  }
  return { kind: 'none' };
}
