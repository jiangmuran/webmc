// Maps vanilla MC block names ("minecraft:foo") to webmc block names
// ("webmc:foo"). Most names match after the namespace swap; a small set
// have been renamed in webmc for clarity (e.g. wool variants are
// "wool_red" not "red_wool"). This table covers the common cases.
//
// Source of names: minecraft.wiki block list. Behavioral spec — clean-room.

const RENAMES: Readonly<Record<string, string>> = {
  // Wool: webmc uses "wool_<color>" naming.
  white_wool: 'wool_white',
  red_wool: 'wool_red',
  orange_wool: 'wool_orange',
  yellow_wool: 'wool_yellow',
  lime_wool: 'wool_lime',
  green_wool: 'wool_green',
  cyan_wool: 'wool_cyan',
  light_blue_wool: 'wool_light_blue',
  blue_wool: 'wool_blue',
  purple_wool: 'wool_purple',
  magenta_wool: 'wool_magenta',
  pink_wool: 'wool_pink',
  brown_wool: 'wool_brown',
  black_wool: 'wool_black',
  gray_wool: 'wool_gray',
  light_gray_wool: 'wool_light_gray',
  // Aliases.
  grass: 'grass_block', // pre-1.20 naming for the surface block
  snow_layer: 'snow', // simplified
};

const ID_NAMESPACE_RE = /^minecraft:/;

export function mapVanillaName(name: string): string {
  // Strip namespace if present.
  const local = name.replace(ID_NAMESPACE_RE, '');
  const renamed = RENAMES[local] ?? local;
  return `webmc:${renamed}`;
}

// Resolve a vanilla name into a webmc registry id, or fall back to a
// caller-supplied id (e.g. stone) if unknown. The fallback is the safe
// answer during import — unknown blocks become stone, never crash.
export function resolveVanillaName(
  name: string,
  byName: (n: string) => number | undefined,
  fallbackId: number,
): number {
  const webmc = mapVanillaName(name);
  return byName(webmc) ?? fallbackId;
}
