import { describe, it, expect } from 'vitest';
import { CROPS, growthTick, harvestDrops } from './crops';

describe('crops', () => {
  it('does not grow below minLight', () => {
    const wheat = CROPS.wheat;
    const next = growthTick(wheat, 0, { lightLevel: 2, hydrated: true, rng: () => 0.01 });
    expect(next).toBe(0);
  });

  it('grows eventually in good conditions', () => {
    const wheat = CROPS.wheat;
    let stage = 0;
    for (let i = 0; i < 1000 && stage < wheat.maxStage; i++) {
      stage = growthTick(wheat, stage, { lightLevel: 15, hydrated: true, rng: Math.random });
    }
    expect(stage).toBe(wheat.maxStage);
  });

  it('stops growing at maxStage', () => {
    const wheat = CROPS.wheat;
    const next = growthTick(wheat, wheat.maxStage, {
      lightLevel: 15,
      hydrated: true,
      rng: () => 0,
    });
    expect(next).toBe(wheat.maxStage);
  });

  it('harvestDrops returns seeds for immature wheat', () => {
    const wheat = CROPS.wheat;
    const drops = harvestDrops(wheat, 2, () => 0.5);
    expect(drops).toHaveLength(1);
    expect(drops[0]?.item).toBe(wheat.seed);
  });

  it('harvestDrops returns mature item for ripe wheat', () => {
    const wheat = CROPS.wheat;
    const drops = harvestDrops(wheat, wheat.maxStage, () => 0.1); // low rng → no extra seeds
    expect(drops.some((d) => d.item === wheat.mature)).toBe(true);
  });

  it('carrot drops 1-5 carrots when ripe', () => {
    const carrot = CROPS.carrot;
    const drops = harvestDrops(carrot, carrot.maxStage, () => 0.9);
    expect(drops[0]?.count).toBeGreaterThanOrEqual(carrot.matureCountMin);
    expect(drops[0]?.count).toBeLessThanOrEqual(carrot.matureCountMax);
  });

  it('hydrated factor doubles growth chance', () => {
    const wheat = CROPS.wheat;
    // Rig an rng that returns just above baseGrowthChance — unhydrated = no
    // grow, hydrated = grow (since chance doubles).
    const r = wheat.baseGrowthChance * 1.5;
    expect(growthTick(wheat, 0, { lightLevel: 15, hydrated: false, rng: () => r })).toBe(0);
    expect(growthTick(wheat, 0, { lightLevel: 15, hydrated: true, rng: () => r })).toBe(1);
  });
});
