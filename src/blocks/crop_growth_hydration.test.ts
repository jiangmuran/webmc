import { describe, it, expect } from 'vitest';
import { canGrow, growthChance, tickGrowth, type CropTile } from './crop_growth_hydration';

const base: CropTile = {
  stage: 0,
  maxStage: 7,
  onFarmland: true,
  farmlandHydrated: true,
  skyLightLevel: 15,
  neighborhoodBonus: 0,
};

describe('crop growth hydration', () => {
  it('grows on hydrated farmland in light', () => {
    expect(canGrow(base)).toBe(true);
  });

  it('not on dirt', () => {
    expect(canGrow({ ...base, onFarmland: false })).toBe(false);
  });

  it('mature stays at max', () => {
    expect(canGrow({ ...base, stage: 7 })).toBe(false);
  });

  it('dark too dim', () => {
    expect(canGrow({ ...base, skyLightLevel: 5 })).toBe(false);
  });

  it('hydrated chance higher', () => {
    const dry = growthChance({ ...base, farmlandHydrated: false });
    const wet = growthChance(base);
    expect(wet).toBeGreaterThan(dry);
  });

  it('neighborhood bonus helps', () => {
    const loner = growthChance(base);
    const surrounded = growthChance({ ...base, neighborhoodBonus: 10 });
    expect(surrounded).toBeGreaterThan(loner);
  });

  it('tick advances sometimes', () => {
    expect(tickGrowth(base, () => 0).stage).toBe(1);
  });

  it('bad roll no grow', () => {
    expect(tickGrowth(base, () => 0.99).stage).toBe(0);
  });
});
