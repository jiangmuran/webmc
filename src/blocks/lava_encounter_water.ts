// Wiki (minecraft.wiki/w/Cobblestone#Post-generation): "When water
// and flowing lava come into contact, the flowing lava is replaced
// by cobblestone. However, if the lava flows on top of the water
// from above, stone is created instead. Non-flowing lava (a lava
// source block) turns into obsidian upon contact with water."
//
// Rules (the lava is what transforms; the water stays):
//   lava SOURCE + any water       → obsidian
//   flowing lava FROM ABOVE water → stone
//   flowing lava ANY OTHER side   → cobblestone
//
// Old code returned `stone` whenever the WATER was a source block,
// regardless of whether the lava was flowing from above — wiki only
// produces stone in the from-above case. Standard horizontal lava-
// to-water-source contact (the classic cobblestone generator) was
// silently producing stone instead of cobblestone.
export function lavaMeetsWater(
  lavaIsSource: boolean,
  _waterIsSource: boolean,
  lavaFlowFromAbove = false,
): 'obsidian' | 'cobblestone' | 'stone' {
  if (lavaIsSource) return 'obsidian';
  if (lavaFlowFromAbove) return 'stone';
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
