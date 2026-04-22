import { describe, it, expect } from 'vitest';
import { hatchProgressChance, tickEgg, tryTrample, MAX_STAGE } from './turtle_egg';

describe('turtle egg', () => {
  it('night faster than day', () => {
    expect(hatchProgressChance(15000)).toBeGreaterThan(hatchProgressChance(6000));
  });

  it('stage advances', () => {
    const e = { count: 2, hatchStage: 0 };
    const r = tickEgg(e, { worldTick: 15000, rand: () => 0 });
    expect(r.advanced).toBe(true);
    expect(e.hatchStage).toBe(1);
  });

  it('eventually hatches', () => {
    const e = { count: 2, hatchStage: MAX_STAGE };
    const r = tickEgg(e, { worldTick: 15000, rand: () => 0 });
    expect(r.hatched).toBe(true);
    expect(e.count).toBe(0);
  });

  it('no roll, no progress', () => {
    const e = { count: 2, hatchStage: 0 };
    tickEgg(e, { worldTick: 6000, rand: () => 0.99 });
    expect(e.hatchStage).toBe(0);
  });

  it('trample', () => {
    expect(tryTrample(() => 0)).toBe(true);
    expect(tryTrample(() => 0.99)).toBe(false);
  });
});
