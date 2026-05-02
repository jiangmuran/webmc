// Reverse of vanilla_block_map: webmc block names → vanilla MC names.
// Most names round-trip via namespace swap; the same renames as the
// forward direction are inverted here for the few exceptions.
//
// Used by the export side: when emitting a vanilla-flavored NBT save,
// translate webmc names to minecraft names so other tooling can read it.

const REVERSE_RENAMES: Readonly<Record<string, string>> = {
  // wool_<color> → <color>_wool
  wool_white: 'white_wool',
  wool_red: 'red_wool',
  wool_orange: 'orange_wool',
  wool_yellow: 'yellow_wool',
  wool_lime: 'lime_wool',
  wool_green: 'green_wool',
  wool_cyan: 'cyan_wool',
  wool_light_blue: 'light_blue_wool',
  wool_blue: 'blue_wool',
  wool_purple: 'purple_wool',
  wool_magenta: 'magenta_wool',
  wool_pink: 'pink_wool',
  wool_brown: 'brown_wool',
  wool_black: 'black_wool',
  wool_gray: 'gray_wool',
  wool_light_gray: 'light_gray_wool',
};

const ID_NAMESPACE_RE = /^webmc:/;

export function mapWebmcToVanillaName(name: string): string {
  const local = name.replace(ID_NAMESPACE_RE, '');
  const renamed = REVERSE_RENAMES[local] ?? local;
  return `minecraft:${renamed}`;
}
