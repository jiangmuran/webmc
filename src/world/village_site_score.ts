// Village POI scoring. A "village" is detected when there are enough
// job sites and beds within a radius. Villager raid potential depends
// on bed count; iron-golem spawn threshold depends on villager count.

export interface VillageCensus {
  beds: number;
  villagers: number;
  jobSites: number;
}

export const MIN_VILLAGE_BEDS = 3;
export const MIN_VILLAGE_VILLAGERS = 2;
export const IRON_GOLEM_VILLAGER_THRESHOLD = 10;

export function isVillage(c: VillageCensus): boolean {
  return c.beds >= MIN_VILLAGE_BEDS && c.villagers >= MIN_VILLAGE_VILLAGERS;
}

export function canSpawnIronGolem(c: VillageCensus): boolean {
  return isVillage(c) && c.villagers >= IRON_GOLEM_VILLAGER_THRESHOLD;
}

// "Size" for raid wave scaling: 1 + floor(beds/3).
export function raidSizeMultiplier(c: VillageCensus): number {
  if (!isVillage(c)) return 0;
  return 1 + Math.floor(c.beds / 3);
}

// Gossip-diffusion radius — villager-to-villager chat radius at a
// gathering bell.
export const GOSSIP_RADIUS = 48;
