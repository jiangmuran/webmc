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
});
