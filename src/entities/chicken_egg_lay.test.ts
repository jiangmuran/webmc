import { describe, it, expect } from 'vitest';
import {
  rollNextEggDelay,
  tick,
  thrownEggHatchesChickenChance,
  rareQuadHatch,
  EGG_LAY_MIN_TICKS,
  EGG_LAY_MAX_TICKS,
} from './chicken_egg_lay';

describe('chicken egg lay', () => {
  it('delay in range', () => {
    for (let i = 0; i < 50; i++) {
      const d = rollNextEggDelay(Math.random);
      expect(d).toBeGreaterThanOrEqual(EGG_LAY_MIN_TICKS);
      expect(d).toBeLessThanOrEqual(EGG_LAY_MAX_TICKS);
    }
  });

  it('baby no egg', () => {
    const r = tick({ ticksUntilNextEgg: 1, isBaby: true });
    expect(r.laidEgg).toBe(false);
  });

  it('lays when counter hits', () => {
    const r = tick({ ticksUntilNextEgg: 1, isBaby: false });
    expect(r.laidEgg).toBe(true);
  });

  it('hatch chances match wiki', () => {
    // minecraft.wiki/w/Egg: 1/8 chance for 1 chick, 1/256 chance for 4 chicks.
    expect(thrownEggHatchesChickenChance()).toBeCloseTo(1 / 8, 6);
    expect(rareQuadHatch()).toBeCloseTo(1 / 256, 6);
    expect(rareQuadHatch()).toBeLessThan(thrownEggHatchesChickenChance());
  });
});
