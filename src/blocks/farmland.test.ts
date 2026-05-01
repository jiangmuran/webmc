import { describe, it, expect } from 'vitest';
import { jumpTrample, makeFarmland, tickFarmland } from './farmland';

describe('farmland hydration', () => {
  it('water nearby → moisture = 7', () => {
    const f = makeFarmland();
    tickFarmland(f, { hasWaterWithin4: true, isRaining: false, dtSec: 1 });
    expect(f.moistureLevel).toBe(7);
    expect(f.isDry).toBe(false);
  });

  it('rain wets even without adjacent water', () => {
    const f = makeFarmland();
    tickFarmland(f, { hasWaterWithin4: false, isRaining: true, dtSec: 1 });
    expect(f.moistureLevel).toBe(7);
  });

  it('dries out over ~20s', () => {
    const f = makeFarmland(7);
    let reverted = false;
    for (let i = 0; i < 300; i++) {
      const r = tickFarmland(f, { hasWaterWithin4: false, isRaining: false, dtSec: 0.1 });
      if (r.revertsToDirt) {
        reverted = true;
        break;
      }
    }
    expect(reverted).toBe(true);
  });

  it('jump from > 0.5 blocks tramples (wiki: deterministic)', () => {
    // Wiki (minecraft.wiki/w/Farmland): "Any entity that falls onto
    // farmland from a height of more than half a block (0.5 blocks)
    // turns it back into dirt." Old code required 3+ blocks — 6×
    // too high.
    const f = makeFarmland(7);
    expect(jumpTrample(f, 0.6)).toBe(true);
    expect(f.isDry).toBe(true);
    const f2 = makeFarmland(7);
    expect(jumpTrample(f2, 3)).toBe(true);
  });

  it('half-slab fall (== 0.5) does NOT trample', () => {
    const f = makeFarmland(7);
    expect(jumpTrample(f, 0.5)).toBe(false);
  });
});
