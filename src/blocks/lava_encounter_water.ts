// Wiki-spec result of lava meeting water (the lava is the one that
// transforms; the water stays):
//   lava SOURCE + any water → obsidian
//   lava FLOW + water SOURCE → stone
//   lava FLOW + water FLOW → cobblestone
// Source: minecraft.wiki/w/Obsidian + minecraft.wiki/w/Cobblestone +
// minecraft.wiki/w/Stone (Bedrock/Java parity post-1.18).
export function lavaMeetsWater(
  lavaIsSource: boolean,
  waterIsSource: boolean,
): 'obsidian' | 'cobblestone' | 'stone' {
  if (lavaIsSource) return 'obsidian';
  if (waterIsSource) return 'stone';
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
