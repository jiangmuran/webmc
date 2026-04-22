// Crop growth. Each crop has N stages (0 = seed, N-1 = fully grown). Every
// tick advances a stage with probability determined by light level, water
// proximity, and a per-crop base rate. Fully-grown crops drop multiple
// items when broken; immature ones drop the seed only.

export type CropKind = 'wheat' | 'carrot' | 'potato' | 'beetroot' | 'melon_stem' | 'pumpkin_stem';

export interface CropDef {
  kind: CropKind;
  maxStage: number;
  baseGrowthChance: number; // per tick, before light/water modifiers
  minLight: number; // skylight threshold for any growth
  wateredFactor: number; // multiplier when adjacent farmland is hydrated
  seed: string;
  mature: string;
  matureCountMin: number;
  matureCountMax: number;
}

export const CROPS: Record<CropKind, CropDef> = {
  wheat: {
    kind: 'wheat',
    maxStage: 7,
    baseGrowthChance: 0.1,
    minLight: 9,
    wateredFactor: 2,
    seed: 'webmc:wheat_seeds',
    mature: 'webmc:wheat',
    matureCountMin: 1,
    matureCountMax: 1,
  },
  carrot: {
    kind: 'carrot',
    maxStage: 7,
    baseGrowthChance: 0.1,
    minLight: 9,
    wateredFactor: 2,
    seed: 'webmc:carrot',
    mature: 'webmc:carrot',
    matureCountMin: 1,
    matureCountMax: 5,
  },
  potato: {
    kind: 'potato',
    maxStage: 7,
    baseGrowthChance: 0.1,
    minLight: 9,
    wateredFactor: 2,
    seed: 'webmc:potato',
    mature: 'webmc:potato',
    matureCountMin: 1,
    matureCountMax: 4,
  },
  beetroot: {
    kind: 'beetroot',
    maxStage: 3,
    baseGrowthChance: 0.08,
    minLight: 9,
    wateredFactor: 2,
    seed: 'webmc:beetroot_seeds',
    mature: 'webmc:beetroot',
    matureCountMin: 1,
    matureCountMax: 3,
  },
  melon_stem: {
    kind: 'melon_stem',
    maxStage: 7,
    baseGrowthChance: 0.05,
    minLight: 9,
    wateredFactor: 2,
    seed: 'webmc:melon_seeds',
    mature: 'webmc:melon',
    matureCountMin: 1,
    matureCountMax: 1,
  },
  pumpkin_stem: {
    kind: 'pumpkin_stem',
    maxStage: 7,
    baseGrowthChance: 0.05,
    minLight: 9,
    wateredFactor: 2,
    seed: 'webmc:pumpkin_seeds',
    mature: 'webmc:pumpkin',
    matureCountMin: 1,
    matureCountMax: 1,
  },
};

export interface CropTickContext {
  lightLevel: number;
  hydrated: boolean; // adjacent farmland irrigated
  rng: () => number;
}

// Returns the next stage (may equal current) after one growth tick.
export function growthTick(def: CropDef, currentStage: number, ctx: CropTickContext): number {
  if (currentStage >= def.maxStage) return currentStage;
  if (ctx.lightLevel < def.minLight) return currentStage;
  let chance = def.baseGrowthChance;
  if (ctx.hydrated) chance *= def.wateredFactor;
  if (ctx.rng() < chance) return currentStage + 1;
  return currentStage;
}

export interface Drop {
  item: string;
  count: number;
}

export function harvestDrops(def: CropDef, stage: number, rng: () => number = Math.random): Drop[] {
  if (stage < def.maxStage) {
    return [{ item: def.seed, count: 1 }];
  }
  const matureCount =
    def.matureCountMin + Math.floor(rng() * (def.matureCountMax - def.matureCountMin + 1));
  const drops: Drop[] = [{ item: def.mature, count: matureCount }];
  if (def.seed !== def.mature) {
    // MC behaviour: fully-grown wheat drops 1 wheat + 0-3 seeds.
    const seedExtra = Math.floor(rng() * 4);
    if (seedExtra > 0) drops.push({ item: def.seed, count: seedExtra });
  }
  return drops;
}
