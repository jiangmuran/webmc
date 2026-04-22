import { describe, it, expect } from 'vitest';
import { applyBoneMeal } from './bone_meal';

describe('bone meal', () => {
  it('advances crop stages', () => {
    const r = applyBoneMeal({ kind: 'crop', currentStage: 1, maxStage: 7 }, () => 0.5);
    expect(r.consumed).toBe(true);
    expect(r.newStage).toBeGreaterThan(1);
  });

  it('refuses fully grown crop', () => {
    const r = applyBoneMeal({ kind: 'crop', currentStage: 7, maxStage: 7 });
    expect(r.consumed).toBe(false);
  });

  it('sometimes grows a sapling', () => {
    let grew = 0;
    for (let i = 0; i < 1000; i++) {
      const r = applyBoneMeal({ kind: 'sapling', growthStage: 0, maxGrowth: 4 }, Math.random);
      if (r.newStage !== undefined && r.newStage > 0) grew++;
    }
    expect(grew).toBeGreaterThan(300);
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
