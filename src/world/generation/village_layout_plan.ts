export type VillageType = 'plains' | 'desert' | 'savanna' | 'taiga' | 'snowy';

export interface BuildingSpec {
  id: string;
  weight: number;
}

const COMMON: BuildingSpec[] = [
  { id: 'small_house', weight: 4 },
  { id: 'big_house', weight: 2 },
  { id: 'church', weight: 1 },
  { id: 'butcher_shop', weight: 1 },
  { id: 'fletcher_house', weight: 1 },
  { id: 'tannery', weight: 1 },
  { id: 'library', weight: 1 },
  { id: 'farm', weight: 3 },
  { id: 'mason_house', weight: 1 },
  { id: 'blacksmith', weight: 1 },
];

export function pickBuilding(type: VillageType, rng: () => number): string {
  const total = COMMON.reduce((s, b) => s + b.weight, 0);
  let r = rng() * total;
  for (const b of COMMON) {
    r -= b.weight;
    if (r < 0) return `${type}_${b.id}`;
  }
  return `${type}_small_house`;
}

export function villageBuildingCount(rng: () => number): number {
  return 4 + Math.floor(rng() * 8);
}

export function hasIronGolemSpawner(buildingCount: number): boolean {
  return buildingCount >= 6;
}
