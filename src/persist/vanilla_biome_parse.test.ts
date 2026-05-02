import { describe, it, expect } from 'vitest';
import { parseVanillaBiome, BiomeParseError } from './vanilla_biome_parse';

describe('vanilla biome parser', () => {
  it('parses a plains-style biome', () => {
    const b = parseVanillaBiome(
      JSON.stringify({
        temperature: 0.8,
        downfall: 0.4,
        has_precipitation: true,
        effects: {
          fog_color: 12638463,
          water_color: 4159204,
          water_fog_color: 329011,
          sky_color: 7907327,
        },
        spawners: {
          monster: [
            { type: 'minecraft:zombie', weight: 95, min_count: 4, max_count: 4 },
            { type: 'minecraft:skeleton', weight: 100 },
          ],
          creature: [{ type: 'minecraft:cow', weight: 8 }],
        },
      }),
    );
    expect(b.temperature).toBeCloseTo(0.8);
    expect(b.downfall).toBeCloseTo(0.4);
    expect(b.hasPrecipitation).toBe(true);
    expect(b.effects.fogColor).toBe(12638463);
    expect(b.effects.waterColor).toBe(4159204);
    expect(b.spawners.monster?.[0]).toEqual({
      type: 'webmc:zombie',
      weight: 95,
      minCount: 4,
      maxCount: 4,
    });
    expect(b.spawners.monster?.[1]?.type).toBe('webmc:skeleton');
    expect(b.spawners.creature?.[0]?.type).toBe('webmc:cow');
  });

  it('falls back to default effect colors when missing', () => {
    const b = parseVanillaBiome(JSON.stringify({ temperature: 0.5 }));
    expect(b.effects.fogColor).toBe(0xc0d8ff);
    expect(b.effects.waterColor).toBe(0x3f76e4);
    expect(b.effects.foliageColor).toBeNull();
    expect(b.spawners.monster).toBeUndefined();
  });

  it('treats legacy precipitation:"none" as has_precipitation=false', () => {
    const b = parseVanillaBiome(JSON.stringify({ temperature: 0.5, precipitation: 'none' }));
    expect(b.hasPrecipitation).toBe(false);
  });

  it('reads camelCase minCount / maxCount as a fallback', () => {
    const b = parseVanillaBiome(
      JSON.stringify({
        spawners: { monster: [{ type: 'minecraft:zombie', minCount: 2, maxCount: 5 }] },
      }),
    );
    expect(b.spawners.monster?.[0]?.minCount).toBe(2);
    expect(b.spawners.monster?.[0]?.maxCount).toBe(5);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaBiome('not json')).toThrow(BiomeParseError);
  });
});
