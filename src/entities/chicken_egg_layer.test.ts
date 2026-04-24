import { describe, it, expect } from 'vitest';
import {
  initialEggTimer,
  tickEggs,
  MIN_EGG_INTERVAL_TICKS,
  MAX_EGG_INTERVAL_TICKS,
  type ChickenState,
} from './chicken_egg_layer';

const adult: ChickenState = {
  ticksUntilNextEgg: 100,
  isBaby: false,
  hasJockeyRider: false,
};

describe('chicken egg layer', () => {
  it('initial timer bounded', () => {
    const t = initialEggTimer(() => 0.5);
    expect(t).toBeGreaterThanOrEqual(MIN_EGG_INTERVAL_TICKS);
    expect(t).toBeLessThan(MAX_EGG_INTERVAL_TICKS);
  });

  it('baby no egg', () => {
    const r = tickEggs({ ...adult, isBaby: true }, () => 0.5);
    expect(r.laid).toBe(false);
  });

  it('tick decrements', () => {
    const r = tickEggs(adult, () => 0.5);
    expect(r.state.ticksUntilNextEgg).toBe(99);
  });

  it('egg laid at zero', () => {
    const r = tickEggs({ ...adult, ticksUntilNextEgg: 1 }, () => 0.5);
    expect(r.laid).toBe(true);
  });

  it('next timer set after laying', () => {
    const r = tickEggs({ ...adult, ticksUntilNextEgg: 1 }, () => 0.5);
    expect(r.state.ticksUntilNextEgg).toBeGreaterThanOrEqual(MIN_EGG_INTERVAL_TICKS);
  });
});
