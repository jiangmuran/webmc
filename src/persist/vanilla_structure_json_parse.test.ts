import { describe, it, expect } from 'vitest';
import { parseVanillaStructureJson, StructureJsonParseError } from './vanilla_structure_json_parse';

describe('vanilla worldgen structure JSON parser', () => {
  it('parses a jigsaw structure with biome tag', () => {
    const s = parseVanillaStructureJson(
      JSON.stringify({
        type: 'minecraft:jigsaw',
        biomes: '#minecraft:has_structure/village_plains',
        step: 'surface_structures',
        start_pool: 'minecraft:village/plains/town_centers',
        size: 6,
      }),
    );
    expect(s.type).toBe('webmc:jigsaw');
    expect(s.biomes).toEqual(['#webmc:has_structure/village_plains']);
    expect(s.step).toBe('surface_structures');
    expect(s.raw['start_pool']).toBe('minecraft:village/plains/town_centers');
  });

  it('parses biomes as array of direct names', () => {
    const s = parseVanillaStructureJson(
      JSON.stringify({
        type: 'minecraft:mineshaft',
        biomes: ['minecraft:plains', 'minecraft:forest'],
      }),
    );
    expect(s.biomes).toEqual(['webmc:plains', 'webmc:forest']);
  });

  it('falls back when fields missing', () => {
    const s = parseVanillaStructureJson('{}');
    expect(s.type).toBe('');
    expect(s.biomes).toEqual([]);
    expect(s.step).toBe('');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaStructureJson('nope')).toThrow(StructureJsonParseError);
  });
});
