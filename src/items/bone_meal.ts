// Bone meal — fertilizer. On crops, advances growth by 1-5 stages; on
// grass, spawns short grass / flowers; on saplings, tries to grow the
// tree. Pure with injected rng.

export type BoneMealTarget =
  | { kind: 'crop'; currentStage: number; maxStage: number }
  | { kind: 'sapling'; growthStage: number; maxGrowth: number }
  | { kind: 'grass_block'; hasSpace: boolean }
  | { kind: 'kelp'; currentHeight: number }
  | { kind: 'invalid' };

export interface BoneMealResult {
  consumed: boolean;
  newStage?: number;
  newHeight?: number;
  spawnFlora?: readonly { type: 'short_grass' | 'flower'; x: number; z: number }[];
}

export function applyBoneMeal(
  target: BoneMealTarget,
  rng: () => number = Math.random,
): BoneMealResult {
  switch (target.kind) {
    case 'crop': {
      if (target.currentStage >= target.maxStage) {
        return { consumed: false };
      }
      // Wiki (minecraft.wiki/w/Bone_Meal#Fertilizer): wheat/carrots/
      // potatoes/melon-stem/pumpkin-stem mature 2-5 growth stages
      // (not 1-5). Old `1 + Math.floor(rng() * 5)` underran the
      // average by ~0.5 stages per use.
      const bump = 2 + Math.floor(rng() * 4);
      const newStage = Math.min(target.maxStage, target.currentStage + bump);
      return { consumed: true, newStage };
    }
    case 'sapling': {
      if (target.growthStage >= target.maxGrowth) {
        return { consumed: false };
      }
      // Wiki: saplings/azalea/flowering azalea/mangrove propagule
      // have a 45% chance of growing to the next growth stage
      // (not 50%). Bone meal is consumed regardless.
      const newStage =
        rng() < 0.45 ? Math.min(target.maxGrowth, target.growthStage + 1) : target.growthStage;
      return { consumed: true, newStage };
    }
    case 'grass_block': {
      if (!target.hasSpace) return { consumed: false };
      const flora: { type: 'short_grass' | 'flower'; x: number; z: number }[] = [];
      for (let i = 0; i < 8; i++) {
        const dx = Math.floor((rng() - 0.5) * 8);
        const dz = Math.floor((rng() - 0.5) * 8);
        const type: 'short_grass' | 'flower' = rng() < 0.2 ? 'flower' : 'short_grass';
        flora.push({ type, x: dx, z: dz });
      }
      return { consumed: true, spawnFlora: flora };
    }
    case 'kelp': {
      if (target.currentHeight >= 26) return { consumed: false };
      return { consumed: true, newHeight: target.currentHeight + 1 };
    }
    case 'invalid':
      return { consumed: false };
  }
}
