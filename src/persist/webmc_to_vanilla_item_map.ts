// Reverse of vanilla_item_map: webmc item names → vanilla MC names.
// Mirror table to webmc_to_vanilla_block_map for items.

const REVERSE_RENAMES: Readonly<Record<string, string>> = {
  // grass_block was the renamed form; legacy MC item ID was "grass".
  // (We round-trip to grass_block since modern Java >=1.20 also calls it grass_block.)
};

const ID_NAMESPACE_RE = /^webmc:/;

export function mapWebmcToVanillaItemName(name: string): string {
  const local = name.replace(ID_NAMESPACE_RE, '');
  const renamed = REVERSE_RENAMES[local] ?? local;
  return `minecraft:${renamed}`;
}
