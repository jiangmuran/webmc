import { describe, it, expect } from 'vitest';
import {
  feedFurnaceMinecart,
  igniteTntMinecart,
  makeVariantMinecart,
  tickFurnaceMinecart,
  tickTntMinecart,
} from './minecart_variants';

describe('minecart variants', () => {
  it('chest minecart has 27-slot container', () => {
    const c = makeVariantMinecart('chest');
    expect(c.container?.size).toBe(27);
  });

  it('hopper minecart has 5-slot container', () => {
    const h = makeVariantMinecart('hopper');
    expect(h.container?.size).toBe(5);
  });

  it('furnace minecart runs on coal fuel', () => {
    const f = makeVariantMinecart('furnace');
    expect(tickFurnaceMinecart(f, 0.1)).toBe(false);
    feedFurnaceMinecart(f);
    expect(tickFurnaceMinecart(f, 0.1)).toBe(true);
  });

  it('TNT minecart fuses exactly once and detonates', () => {
    const t = makeVariantMinecart('tnt');
    expect(igniteTntMinecart(t)).toBe(true);
    expect(igniteTntMinecart(t)).toBe(false);
    let detonated = false;
    for (let i = 0; i < 60; i++) {
      if (tickTntMinecart(t, 0.1)) detonated = true;
    }
    expect(detonated).toBe(true);
  });

  it('plain minecart has no container', () => {
    const p = makeVariantMinecart('plain');
    expect(p.container).toBeNull();
  });
});
