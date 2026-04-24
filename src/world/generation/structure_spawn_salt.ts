export const STRUCTURE_SALTS: Record<string, number> = {
  village: 10387312,
  stronghold: 0,
  mineshaft: 10387319,
  shipwreck: 165745295,
  ocean_monument: 10387313,
  woodland_mansion: 10387319,
  jungle_temple: 14357619,
  desert_temple: 14357617,
  igloo: 14357618,
  swamp_hut: 14357620,
  ocean_ruin: 14357621,
  buried_treasure: 10387320,
  pillager_outpost: 165745296,
  ruined_portal: 34222645,
  trail_ruins: 83469867,
  trial_chambers: 94251327,
  nether_fortress: 30084232,
  bastion_remnant: 30084233,
  end_city: 10387313,
  ancient_city: 20083232,
};

export function saltFor(structure: string): number | undefined {
  return STRUCTURE_SALTS[structure];
}

export function structureRngSeed(
  worldSeed: number,
  structure: string,
  chunkX: number,
  chunkZ: number,
): number | undefined {
  const salt = saltFor(structure);
  if (salt === undefined) return undefined;
  let h = worldSeed ^ salt;
  h ^= chunkX * 341873128712;
  h ^= chunkZ * 132897987541;
  return h >>> 0;
}
