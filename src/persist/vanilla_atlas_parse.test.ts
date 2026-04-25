import { describe, it, expect } from 'vitest';
import { parseVanillaAtlas, AtlasParseError } from './vanilla_atlas_parse';

describe('vanilla atlas parser', () => {
  it('parses a typical block atlas', () => {
    const a = parseVanillaAtlas(
      JSON.stringify({
        sources: [
          { type: 'minecraft:directory', source: 'block', prefix: 'block/' },
          { type: 'minecraft:single', resource: 'entity/wolf' },
          { type: 'minecraft:filter', namespace: 'minecraft' },
          { type: 'minecraft:unstitch', resource: 'sheet' },
          { type: 'minecraft:paletted_permutations', textures: ['x'] },
        ],
      }),
    );
    expect(a.sources.map((s) => s.type)).toEqual([
      'directory',
      'single',
      'filter',
      'unstitch',
      'paletted_permutations',
    ]);
    expect(a.sources[0]?.raw['source']).toBe('block');
    expect(a.sources[1]?.raw['resource']).toBe('entity/wolf');
  });

  it('marks unknown source kinds', () => {
    const a = parseVanillaAtlas(JSON.stringify({ sources: [{ type: 'mymod:custom' }] }));
    expect(a.sources[0]?.type).toBe('unknown');
  });

  it('returns empty when sources missing', () => {
    expect(parseVanillaAtlas('{}').sources).toEqual([]);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaAtlas('not json')).toThrow(AtlasParseError);
  });
});
