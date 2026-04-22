import { describe, it, expect } from 'vitest';
import { growNetherWart, harvestNetherWart, makeNetherWart } from './nether_wart';

describe('nether wart', () => {
  it('grows only on soul sand', () => {
    const w = makeNetherWart();
    expect(growNetherWart(w, false, () => 0.01)).toBe(false);
    expect(growNetherWart(w, true, () => 0.01)).toBe(true);
  });

  it('stops at stage 3', () => {
    const w = makeNetherWart();
    w.stage = 3;
    expect(growNetherWart(w, true, () => 0.01)).toBe(false);
  });

  it('mature harvest drops 2-4', () => {
    const w = makeNetherWart();
    w.stage = 3;
    const r = harvestNetherWart(w, 0, () => 0.5);
    expect(r.drops.length).toBeGreaterThanOrEqual(2);
    expect(r.drops.length).toBeLessThanOrEqual(4);
    expect(r.newStage).toBe(0);
  });

  it('fortune adds bonus drops', () => {
    const w = makeNetherWart();
    w.stage = 3;
    const r = harvestNetherWart(w, 3, () => 0.99);
    expect(r.drops.length).toBeGreaterThan(4);
  });

  it('immature drops single wart', () => {
    const w = makeNetherWart();
    w.stage = 1;
    const r = harvestNetherWart(w);
    expect(r.drops.length).toBe(1);
  });
});
