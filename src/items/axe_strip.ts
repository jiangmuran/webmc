// Axe stripping + scraping. Right-click on oak_log → stripped_oak_log;
// right-click on a waxed copper block → un-waxes; on oxidized copper →
// one oxidation tier younger.
//
// Wiki (minecraft.wiki/w/Axe#Stripping): every log/wood/stem/hyphae
// has a stripped variant. Old map only had logs + stems + bamboo;
// _wood, _hyphae, and pale_oak were missing, so axing a spruce_wood
// or crimson_hyphae block was a silent no-op even though wiki
// confirms both are strippable. Sibling blocks/log_strip.ts already
// lists the wood variants; this items-side copy was the holdout.

const STRIP_MAP: Record<string, string> = {
  'webmc:oak_log': 'webmc:stripped_oak_log',
  'webmc:spruce_log': 'webmc:stripped_spruce_log',
  'webmc:birch_log': 'webmc:stripped_birch_log',
  'webmc:jungle_log': 'webmc:stripped_jungle_log',
  'webmc:acacia_log': 'webmc:stripped_acacia_log',
  'webmc:dark_oak_log': 'webmc:stripped_dark_oak_log',
  'webmc:mangrove_log': 'webmc:stripped_mangrove_log',
  'webmc:cherry_log': 'webmc:stripped_cherry_log',
  'webmc:pale_oak_log': 'webmc:stripped_pale_oak_log',
  'webmc:oak_wood': 'webmc:stripped_oak_wood',
  'webmc:spruce_wood': 'webmc:stripped_spruce_wood',
  'webmc:birch_wood': 'webmc:stripped_birch_wood',
  'webmc:jungle_wood': 'webmc:stripped_jungle_wood',
  'webmc:acacia_wood': 'webmc:stripped_acacia_wood',
  'webmc:dark_oak_wood': 'webmc:stripped_dark_oak_wood',
  'webmc:mangrove_wood': 'webmc:stripped_mangrove_wood',
  'webmc:cherry_wood': 'webmc:stripped_cherry_wood',
  'webmc:pale_oak_wood': 'webmc:stripped_pale_oak_wood',
  'webmc:crimson_stem': 'webmc:stripped_crimson_stem',
  'webmc:warped_stem': 'webmc:stripped_warped_stem',
  'webmc:crimson_hyphae': 'webmc:stripped_crimson_hyphae',
  'webmc:warped_hyphae': 'webmc:stripped_warped_hyphae',
  'webmc:bamboo_block': 'webmc:stripped_bamboo_block',
};

// Wiki (minecraft.wiki/w/Axe#Scraping): ALL waxed copper variants
// (full block, cut, stairs, slab, with each oxidation level) can
// be unwaxed by an axe. Old map covered the 4 base-block variants
// + 1 cut-copper, missing 11 cut-copper / stairs / slab combos
// silently kept the wax even after axing.
const WAXED_UNWAX: Record<string, string> = {
  'webmc:waxed_copper_block': 'webmc:copper_block',
  'webmc:waxed_exposed_copper': 'webmc:exposed_copper',
  'webmc:waxed_weathered_copper': 'webmc:weathered_copper',
  'webmc:waxed_oxidized_copper': 'webmc:oxidized_copper',
  // Cut copper
  'webmc:waxed_cut_copper': 'webmc:cut_copper',
  'webmc:waxed_exposed_cut_copper': 'webmc:exposed_cut_copper',
  'webmc:waxed_weathered_cut_copper': 'webmc:weathered_cut_copper',
  'webmc:waxed_oxidized_cut_copper': 'webmc:oxidized_cut_copper',
  // Cut copper stairs
  'webmc:waxed_cut_copper_stairs': 'webmc:cut_copper_stairs',
  'webmc:waxed_exposed_cut_copper_stairs': 'webmc:exposed_cut_copper_stairs',
  'webmc:waxed_weathered_cut_copper_stairs': 'webmc:weathered_cut_copper_stairs',
  'webmc:waxed_oxidized_cut_copper_stairs': 'webmc:oxidized_cut_copper_stairs',
  // Cut copper slab
  'webmc:waxed_cut_copper_slab': 'webmc:cut_copper_slab',
  'webmc:waxed_exposed_cut_copper_slab': 'webmc:exposed_cut_copper_slab',
  'webmc:waxed_weathered_cut_copper_slab': 'webmc:weathered_cut_copper_slab',
  'webmc:waxed_oxidized_cut_copper_slab': 'webmc:oxidized_cut_copper_slab',
  // Chiseled copper (1.21)
  'webmc:waxed_chiseled_copper': 'webmc:chiseled_copper',
  'webmc:waxed_exposed_chiseled_copper': 'webmc:exposed_chiseled_copper',
  'webmc:waxed_weathered_chiseled_copper': 'webmc:weathered_chiseled_copper',
  'webmc:waxed_oxidized_chiseled_copper': 'webmc:oxidized_chiseled_copper',
};

// Wiki (minecraft.wiki/w/Axe#Scraping): every oxidation level of
// every copper variant scrapes back one tier. Old map covered only
// the base block; cut/stairs/slab/chiseled variants silently fell
// through.
const OXIDIZE_BACK: Record<string, string> = {
  'webmc:oxidized_copper': 'webmc:weathered_copper',
  'webmc:weathered_copper': 'webmc:exposed_copper',
  'webmc:exposed_copper': 'webmc:copper_block',
  // Cut copper
  'webmc:oxidized_cut_copper': 'webmc:weathered_cut_copper',
  'webmc:weathered_cut_copper': 'webmc:exposed_cut_copper',
  'webmc:exposed_cut_copper': 'webmc:cut_copper',
  // Cut copper stairs
  'webmc:oxidized_cut_copper_stairs': 'webmc:weathered_cut_copper_stairs',
  'webmc:weathered_cut_copper_stairs': 'webmc:exposed_cut_copper_stairs',
  'webmc:exposed_cut_copper_stairs': 'webmc:cut_copper_stairs',
  // Cut copper slab
  'webmc:oxidized_cut_copper_slab': 'webmc:weathered_cut_copper_slab',
  'webmc:weathered_cut_copper_slab': 'webmc:exposed_cut_copper_slab',
  'webmc:exposed_cut_copper_slab': 'webmc:cut_copper_slab',
  // Chiseled copper
  'webmc:oxidized_chiseled_copper': 'webmc:weathered_chiseled_copper',
  'webmc:weathered_chiseled_copper': 'webmc:exposed_chiseled_copper',
  'webmc:exposed_chiseled_copper': 'webmc:chiseled_copper',
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
