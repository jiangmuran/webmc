import { describe, it, expect } from 'vitest';
import { planBastion, rollBastionLoot } from './bastion';

describe('bastion', () => {
  it('hoglin stables has hoglins', () => {
    expect(planBastion('hoglin_stables').hoglins).toBeGreaterThan(0);
  });

  it('treasure has most gilded blackstone', () => {
    const t = planBastion('treasure').gildedBlackstoneBlocks;
    const h = planBastion('housing_units').gildedBlackstoneBlocks;
    expect(t).toBeGreaterThan(h);
  });

  it('treasure loot can yield netherite', () => {
    const r = rollBastionLoot('treasure', 0.001);
    expect(r?.item).toBe('webmc:netherite_ingot');
  });

  it('generic loot has crying obsidian', () => {
    const r = rollBastionLoot('housing_units', 0.001);
    expect(r?.item).toBe('webmc:crying_obsidian');
  });

  it('all variants have piglins', () => {
    for (const v of ['housing_units', 'bridge', 'hoglin_stables', 'treasure'] as const) {
      expect(planBastion(v).piglins).toBeGreaterThan(0);
    }
  });

  it('bridge + hoglin_stables both spawn hoglins (wiki)', () => {
    // Wiki (minecraft.wiki/w/Bastion_Remnant): "bridges, hoglin stables"
    // are the two variants that can spawn hoglins on generation.
    expect(planBastion('bridge').hoglins).toBeGreaterThan(0);
    expect(planBastion('hoglin_stables').hoglins).toBeGreaterThan(0);
    expect(planBastion('housing_units').hoglins).toBe(0);
    expect(planBastion('treasure').hoglins).toBe(0);
  });
});
