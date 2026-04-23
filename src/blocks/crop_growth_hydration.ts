export interface CropTile {
  stage: number;
  maxStage: number;
  onFarmland: boolean;
  farmlandHydrated: boolean;
  skyLightLevel: number;
  neighborhoodBonus: number;
}

export const MIN_LIGHT_TO_GROW = 9;

export function canGrow(t: CropTile): boolean {
  if (!t.onFarmland) return false;
  if (t.skyLightLevel < MIN_LIGHT_TO_GROW) return false;
  return t.stage < t.maxStage;
}

export function growthChance(t: CropTile): number {
  if (!canGrow(t)) return 0;
  const base = t.farmlandHydrated ? 1 / 3 : 1 / 8;
  return Math.min(1, base + t.neighborhoodBonus * 0.01);
}

export function tickGrowth(t: CropTile, rng: () => number): CropTile {
  if (rng() < growthChance(t)) {
    return { ...t, stage: Math.min(t.maxStage, t.stage + 1) };
  }
  return t;
}
