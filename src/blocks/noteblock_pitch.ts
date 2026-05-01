// Note block. Pitch cycles 0..24 on right-click. Instrument determined
// by block below.

export const NOTES = 25;

export type Instrument =
  | 'harp'
  | 'bass'
  | 'basedrum'
  | 'snare'
  | 'hat'
  | 'guitar'
  | 'flute'
  | 'bell'
  | 'chime'
  | 'xylophone'
  | 'iron_xylophone'
  | 'cow_bell'
  | 'didgeridoo'
  | 'bit'
  | 'banjo'
  | 'pling'
  | 'trumpet';

export function pitchCycle(current: number): number {
  return (current + 1) % NOTES;
}

// Wiki (minecraft.wiki/w/Note_Block): instrument is determined by the
// exact block underneath. Earlier code:
//   - snare missed concrete_powder + heavy_core (heavy_core is a
//     1.21 Trial Chamber block).
//   - bass missed many wood-family items (chest, crafting_table,
//     jukebox, bookshelf, banner, beehive, etc.) which the wiki
//     explicitly lists.
//   - bell/iron_xylophone/bit checks listed *_ore variants, but per
//     wiki ores are basedrum (block-of-X only is the special tone).
//     Those entries were dead code (basedrum check shadowed them) but
//     misleading; removed.
//   - chime listed ice/blue_ice/frosted_ice; wiki specifies only
//     packed_ice as chime. Plain ice has no special instrument.
//   - pumpkin: wiki lists only base "Pumpkin" — carved_pumpkin and
//     jack_o_lantern are different blocks per modern flattening, so
//     they no longer map to didgeridoo.
//   - copper family (block_of_copper / cut_copper / chiseled_copper)
//     plays trumpet per 1.21 winter drop, added.
export function instrumentForBelow(below: string): Instrument {
  if (below.includes('wool')) return 'guitar';
  if (
    below === 'sand' ||
    below === 'red_sand' ||
    below === 'gravel' ||
    below === 'heavy_core' ||
    below.endsWith('_concrete_powder')
  ) {
    return 'snare';
  }
  // Wood family per wiki: logs/stripped/wood/stems/hyphae/mushroom
  // blocks/bamboo planks+block + all manufactured wooden items
  // (planks, stairs, slabs, fences, fence_gates, doors, signs,
  // hanging_signs, pressure_plates, banners, chests, trapped_chest,
  // barrel, beehive/bee_nest, bookshelf, chiseled_bookshelf,
  // composter, crafting_table, cartography_table, lectern, loom,
  // smithing_table, daylight_detector, jukebox, note_block,
  // campfire, soul_campfire, shelf, mangrove_roots).
  if (
    below.endsWith('_log') ||
    below.endsWith('_planks') ||
    below.endsWith('_wood') ||
    below.endsWith('_stem') ||
    below.endsWith('_hyphae') ||
    below.endsWith('_sign') ||
    below.endsWith('_hanging_sign') ||
    below.endsWith('_door') ||
    below.endsWith('_trapdoor') ||
    below.endsWith('_fence') ||
    below.endsWith('_fence_gate') ||
    below.endsWith('_pressure_plate') ||
    below.endsWith('_banner') ||
    below.endsWith('_shelf') ||
    below === 'bamboo_block' ||
    below === 'stripped_bamboo_block' ||
    below === 'mushroom_stem' ||
    below === 'red_mushroom_block' ||
    below === 'brown_mushroom_block' ||
    below === 'mangrove_roots' ||
    below === 'muddy_mangrove_roots' ||
    below === 'chest' ||
    below === 'trapped_chest' ||
    below === 'barrel' ||
    below === 'beehive' ||
    below === 'bee_nest' ||
    below === 'bookshelf' ||
    below === 'chiseled_bookshelf' ||
    below === 'composter' ||
    below === 'crafting_table' ||
    below === 'cartography_table' ||
    below === 'lectern' ||
    below === 'loom' ||
    below === 'smithing_table' ||
    below === 'daylight_detector' ||
    below === 'jukebox' ||
    below === 'note_block' ||
    below === 'campfire' ||
    below === 'soul_campfire'
  ) {
    return 'bass';
  }
  // Glass family: stained glass + tinted_glass + sea_lantern + beacon
  // + conduit → hat.
  if (
    below.includes('glass') ||
    below === 'sea_lantern' ||
    below === 'beacon' ||
    below === 'conduit'
  ) {
    return 'hat';
  }
  // Copper family → trumpet (1.21 winter drop).
  if (
    below === 'copper_block' ||
    below === 'exposed_copper' ||
    below === 'weathered_copper' ||
    below === 'oxidized_copper' ||
    below === 'cut_copper' ||
    below === 'exposed_cut_copper' ||
    below === 'weathered_cut_copper' ||
    below === 'oxidized_cut_copper' ||
    below === 'chiseled_copper' ||
    below === 'exposed_chiseled_copper' ||
    below === 'weathered_chiseled_copper' ||
    below === 'oxidized_chiseled_copper' ||
    below.startsWith('waxed_') // waxed_copper_block / waxed_cut_copper / etc.
  ) {
    return 'trumpet';
  }
  // Stone family: stone, cobblestone, deepslate, basalt, blackstone,
  // andesite/granite/diorite, end_stone, netherrack, ores → basedrum.
  if (
    below === 'stone' ||
    below === 'cobblestone' ||
    below === 'obsidian' ||
    below === 'crying_obsidian' ||
    below.startsWith('deepslate') ||
    below.startsWith('basalt') ||
    below === 'smooth_basalt' ||
    below === 'blackstone' ||
    below === 'andesite' ||
    below === 'granite' ||
    below === 'diorite' ||
    below === 'end_stone' ||
    below === 'netherrack' ||
    below === 'magma_block' ||
    below.endsWith('_ore')
  ) {
    return 'basedrum';
  }
  if (below === 'clay') return 'flute';
  if (below === 'gold_block') return 'bell';
  if (below === 'packed_ice') return 'chime';
  if (below === 'bone_block') return 'xylophone';
  if (below === 'iron_block') return 'iron_xylophone';
  if (below === 'soul_sand') return 'cow_bell';
  if (below === 'pumpkin') return 'didgeridoo';
  if (below === 'emerald_block') return 'bit';
  if (below === 'hay_block') return 'banjo';
  if (below === 'glowstone') return 'pling';
  return 'harp';
}
