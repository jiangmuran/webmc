import { describe, it, expect } from 'vitest';
import { ancientCityRoll, ANCIENT_CITY_LOOT } from './ancient_city_loot';

describe('ancient city loot', () => {
  it('echo shards are the first entry', () => {
    const r = ancientCityRoll('ancient_city', 0.001);
    expect(r?.item).toBe('webmc:echo_shard');
  });

  it('ice box is snowballs or ice', () => {
    const r = ancientCityRoll('ancient_city_ice_box', 0.01);
    expect(r?.item).toBe('webmc:snowball');
  });

  it('disc fragment appears in table', () => {
    const items = ANCIENT_CITY_LOOT.ancient_city.map((e) => e.item);
    expect(items).toContain('webmc:disc_fragment_5');
  });

  it('min/max counts honor the schema', () => {
    const echo = ANCIENT_CITY_LOOT.ancient_city.find((e) => e.item === 'webmc:echo_shard');
    expect(echo?.min).toBe(1);
    expect(echo?.max).toBe(3);
  });
});
