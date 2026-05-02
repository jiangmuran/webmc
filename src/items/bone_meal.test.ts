import { describe, it, expect } from 'vitest';
import { applyBoneMeal } from './bone_meal';

describe('bone meal', () => {
  it('advances crop stages 2-5 (wiki)', () => {
    // rng 0 → bump 2, rng 0.99 → bump 5
    expect(applyBoneMeal({ kind: 'crop', currentStage: 0, maxStage: 7 }, () => 0).newStage).toBe(2);
    expect(applyBoneMeal({ kind: 'crop', currentStage: 0, maxStage: 7 }, () => 0.99).newStage).toBe(
      5,
    );
    // bump never below 2 or above 5
    for (let i = 0; i < 50; i++) {
      const r = applyBoneMeal({ kind: 'crop', currentStage: 0, maxStage: 7 }, Math.random);
      expect(r.newStage).toBeGreaterThanOrEqual(2);
      expect(r.newStage).toBeLessThanOrEqual(5);
    }
  });

  it('refuses fully grown crop', () => {
    const r = applyBoneMeal({ kind: 'crop', currentStage: 7, maxStage: 7 });
    expect(r.consumed).toBe(false);
  });

  it('sapling grows ~45% of the time (wiki)', () => {
    let grew = 0;
    for (let i = 0; i < 2000; i++) {
      const r = applyBoneMeal({ kind: 'sapling', growthStage: 0, maxGrowth: 4 }, Math.random);
      if (r.newStage !== undefined && r.newStage > 0) grew++;
    }
    // 45% target ± stochastic slack
    expect(grew / 2000).toBeGreaterThan(0.4);
    expect(grew / 2000).toBeLessThan(0.5);
  });

  it('sapling chance is exactly 0.45 (wiki, with deterministic rng)', () => {
    // rng 0.44 → grow, 0.45 → no grow, 0.46 → no grow
    expect(
      applyBoneMeal({ kind: 'sapling', growthStage: 0, maxGrowth: 4 }, () => 0.44).newStage,
    ).toBe(1);
    expect(
      applyBoneMeal({ kind: 'sapling', growthStage: 0, maxGrowth: 4 }, () => 0.45).newStage,
    ).toBe(0);
    expect(
      applyBoneMeal({ kind: 'sapling', growthStage: 0, maxGrowth: 4 }, () => 0.46).newStage,
    ).toBe(0);
  });

  it('spawns flora on grass block', () => {
    const r = applyBoneMeal({ kind: 'grass_block', hasSpace: true });
    expect(r.consumed).toBe(true);
    expect(r.spawnFlora?.length).toBeGreaterThan(0);
  });

  it('grows kelp upward', () => {
    const r = applyBoneMeal({ kind: 'kelp', currentHeight: 5 });
    expect(r.consumed).toBe(true);
    expect(r.newHeight).toBe(6);
  });

  it('invalid target → no op', () => {
    expect(applyBoneMeal({ kind: 'invalid' }).consumed).toBe(false);
  });
});
