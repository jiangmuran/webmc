// Overworld biome list with temperature/humidity.

export interface BiomeDef {
  id: string;
  temperature: number;
  humidity: number;
  category:
    | 'warm'
    | 'lush'
    | 'cold'
    | 'frozen'
    | 'desert'
    | 'ocean'
    | 'cave'
    | 'mountain'
    | 'swamp'
    | 'jungle';
}

export const OVERWORLD_BIOMES: BiomeDef[] = [
  { id: 'plains', temperature: 0.8, humidity: 0.4, category: 'lush' },
  { id: 'forest', temperature: 0.7, humidity: 0.8, category: 'lush' },
  { id: 'flower_forest', temperature: 0.7, humidity: 0.8, category: 'lush' },
  { id: 'taiga', temperature: 0.25, humidity: 0.8, category: 'cold' },
  { id: 'snowy_taiga', temperature: -0.5, humidity: 0.4, category: 'frozen' },
  { id: 'snowy_plains', temperature: 0.0, humidity: 0.5, category: 'frozen' },
  { id: 'desert', temperature: 2.0, humidity: 0.0, category: 'desert' },
  { id: 'savanna', temperature: 1.2, humidity: 0.0, category: 'warm' },
  { id: 'jungle', temperature: 0.95, humidity: 0.9, category: 'jungle' },
  { id: 'bamboo_jungle', temperature: 0.95, humidity: 0.9, category: 'jungle' },
  { id: 'swamp', temperature: 0.8, humidity: 0.9, category: 'swamp' },
  { id: 'mangrove_swamp', temperature: 0.8, humidity: 0.9, category: 'swamp' },
  { id: 'ocean', temperature: 0.5, humidity: 0.5, category: 'ocean' },
  { id: 'frozen_ocean', temperature: 0.0, humidity: 0.5, category: 'ocean' },
  { id: 'warm_ocean', temperature: 0.8, humidity: 0.5, category: 'ocean' },
  { id: 'deep_ocean', temperature: 0.5, humidity: 0.5, category: 'ocean' },
  { id: 'cherry_grove', temperature: 0.5, humidity: 0.8, category: 'lush' },
  { id: 'pale_garden', temperature: 0.7, humidity: 0.8, category: 'lush' },
  { id: 'mountain_grove', temperature: -0.2, humidity: 0.8, category: 'mountain' },
  { id: 'jagged_peaks', temperature: -0.7, humidity: 0.9, category: 'mountain' },
  { id: 'stony_peaks', temperature: 1.0, humidity: 0.3, category: 'mountain' },
  { id: 'windswept_hills', temperature: 0.2, humidity: 0.3, category: 'mountain' },
  { id: 'badlands', temperature: 2.0, humidity: 0.0, category: 'desert' },
  { id: 'dripstone_caves', temperature: 0.8, humidity: 0.4, category: 'cave' },
  { id: 'lush_caves', temperature: 0.5, humidity: 0.5, category: 'cave' },
  { id: 'deep_dark', temperature: 0.8, humidity: 0.4, category: 'cave' },
];

export function byId(id: string): BiomeDef | null {
  return OVERWORLD_BIOMES.find((b) => b.id === id) ?? null;
}

export function byCategory(cat: BiomeDef['category']): BiomeDef[] {
  return OVERWORLD_BIOMES.filter((b) => b.category === cat);
}
