import { describe, it, expect } from 'vitest';
import { oreAtY, poolTotalTries, ORE_TABLE } from './ore_vein_size_table';

describe('ore vein size table', () => {
  it('diamond at deep y', () => {
    expect(oreAtY('diamond_ore', -60)).toBeDefined();
  });

  it('diamond at surface undefined', () => {
    expect(oreAtY('diamond_ore', 100)).toBeUndefined();
  });

  it('coal at surface', () => {
    expect(oreAtY('coal_ore', 80)).toBeDefined();
  });

  it('unknown ore undefined', () => {
    expect(oreAtY('unobtainium', 50)).toBeUndefined();
  });

  it('total tries accumulates', () => {
    expect(poolTotalTries()).toBeGreaterThan(0);
  });

  it('emerald spans mountains', () => {
    expect(ORE_TABLE.find((o) => o.id === 'emerald_ore')?.maxY).toBeGreaterThan(200);
  });

  it('coal extends to wiki upper bound Y=256', () => {
    // Wiki minecraft.wiki/w/Coal_Ore: upper batch is even spread
    // Y=136..256. Old maxY=127 cut off the entire upper batch —
    // mountain coal effectively absent.
    expect(oreAtY('coal_ore', 200)).toBeDefined();
    expect(oreAtY('coal_ore', 256)).toBeDefined();
  });

  it('gold extends to wiki lower bound Y=-64', () => {
    // Wiki minecraft.wiki/w/Gold_Ore: lower batch Y=-64..32, peak
    // Y=-16. Old minY=-32 missed the entire bottom 32 blocks of the
    // wiki range.
    expect(oreAtY('gold_ore', -50)).toBeDefined();
    expect(oreAtY('gold_ore', -64)).toBeDefined();
  });
});
