import { describe, it, expect } from 'vitest';
import {
  rollNextEggDelay,
  tick,
  thrownEggHatchesChickenChance,
  rareTripleHatch,
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

  it('hatch chances', () => {
    expect(thrownEggHatchesChickenChance()).toBeLessThan(1);
    expect(rareTripleHatch()).toBeLessThan(thrownEggHatchesChickenChance());
  });
});
