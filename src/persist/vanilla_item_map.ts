// Maps vanilla MC item names ("minecraft:foo") to webmc item names
// ("webmc:foo"). Most names match after the namespace swap. A small set
// have been renamed in webmc — register them here when they appear.
//
// Source of names: minecraft.wiki item list. Behavioral spec — clean-room.

const RENAMES: Readonly<Record<string, string>> = {
  // Vanilla used "grass" for both block and item up to 1.20; webmc renamed.
  grass: 'grass_block',
};

const ID_NAMESPACE_RE = /^minecraft:/;

export function mapVanillaItemName(name: string): string {
  const local = name.replace(ID_NAMESPACE_RE, '');
  const renamed = RENAMES[local] ?? local;
  return `webmc:${renamed}`;
}

export function resolveVanillaItem(
  name: string,
  byName: (n: string) => number | undefined,
): number | undefined {
  return byName(mapVanillaItemName(name));
}
