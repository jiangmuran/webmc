export function lavaMeetsWater(
  lavaIsSource: boolean,
  waterIsSource: boolean,
): 'obsidian' | 'cobblestone' | 'stone' | undefined {
  if (lavaIsSource && waterIsSource) return 'obsidian';
  if (lavaIsSource && !waterIsSource) return 'cobblestone';
  if (!lavaIsSource && waterIsSource) return 'stone';
  return 'cobblestone';
}

export function lavaBurnsNeighbor(
  neighborId: string,
  adjacentLava: number,
  rng: () => number,
): boolean {
  if (adjacentLava === 0) return false;
  const flammable = ['oak_log', 'oak_planks', 'wool', 'leaves', 'hay_block'];
  if (!flammable.some((f) => neighborId.includes(f))) return false;
  return rng() < 0.2 * adjacentLava;
}
