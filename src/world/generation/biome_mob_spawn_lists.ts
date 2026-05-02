export interface SpawnEntry {
  id: string;
  weight: number;
  minGroup: number;
  maxGroup: number;
}

const LISTS: Record<string, Record<'passive' | 'hostile' | 'ambient', SpawnEntry[]>> = {
  plains: {
    // Wiki (minecraft.wiki/w/Plains): passive spawns include donkey
    // (weight 1, group 1-3) alongside cow/pig/sheep/chicken/horse.
    // Old list omitted donkey — natural-world donkeys never spawned
    // in plains.
    passive: [
      { id: 'cow', weight: 8, minGroup: 4, maxGroup: 4 },
      { id: 'pig', weight: 10, minGroup: 4, maxGroup: 4 },
      { id: 'sheep', weight: 12, minGroup: 4, maxGroup: 4 },
      { id: 'chicken', weight: 10, minGroup: 4, maxGroup: 4 },
      { id: 'horse', weight: 5, minGroup: 2, maxGroup: 6 },
      { id: 'donkey', weight: 1, minGroup: 1, maxGroup: 3 },
    ],
    hostile: [
      { id: 'zombie', weight: 95, minGroup: 4, maxGroup: 4 },
      { id: 'skeleton', weight: 100, minGroup: 4, maxGroup: 4 },
      { id: 'creeper', weight: 100, minGroup: 4, maxGroup: 4 },
      { id: 'spider', weight: 100, minGroup: 4, maxGroup: 4 },
    ],
    ambient: [{ id: 'bat', weight: 10, minGroup: 8, maxGroup: 8 }],
  },
  desert: {
    passive: [{ id: 'rabbit', weight: 4, minGroup: 2, maxGroup: 3 }],
    hostile: [
      { id: 'husk', weight: 95, minGroup: 4, maxGroup: 4 },
      { id: 'skeleton', weight: 100, minGroup: 4, maxGroup: 4 },
    ],
    ambient: [],
  },
};

export function mobsInBiome(
  biome: string,
  category: 'passive' | 'hostile' | 'ambient',
): readonly SpawnEntry[] {
  return LISTS[biome]?.[category] ?? [];
}
