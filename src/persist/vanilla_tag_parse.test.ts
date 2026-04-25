import { describe, it, expect } from 'vitest';
import { parseVanillaTag, TagParseError } from './vanilla_tag_parse';

describe('vanilla tag parser', () => {
  it('parses a simple item tag with direct values', () => {
    const t = parseVanillaTag(
      JSON.stringify({
        values: ['minecraft:oak_log', 'minecraft:spruce_log', 'minecraft:birch_log'],
      }),
    );
    expect(t.replace).toBe(false);
    expect(t.values).toEqual(['webmc:oak_log', 'webmc:spruce_log', 'webmc:birch_log']);
    expect(t.tagRefs).toEqual([]);
  });

  it('extracts tag references with # prefix into tagRefs', () => {
    const t = parseVanillaTag(
      JSON.stringify({
        values: ['#minecraft:logs', 'minecraft:bamboo'],
      }),
    );
    expect(t.values).toEqual(['webmc:bamboo']);
    expect(t.tagRefs).toEqual(['#webmc:logs']);
  });

  it('honors replace: true', () => {
    const t = parseVanillaTag(JSON.stringify({ replace: true, values: ['minecraft:dirt'] }));
    expect(t.replace).toBe(true);
    expect(t.values).toEqual(['webmc:dirt']);
  });

  it('handles {id} object form for entries', () => {
    const t = parseVanillaTag(
      JSON.stringify({ values: [{ id: 'minecraft:cobblestone' }, { id: '#minecraft:stones' }] }),
    );
    expect(t.values).toEqual(['webmc:cobblestone']);
    expect(t.tagRefs).toEqual(['#webmc:stones']);
  });

  it('returns empty arrays for missing values', () => {
    const t = parseVanillaTag('{}');
    expect(t.values).toEqual([]);
    expect(t.tagRefs).toEqual([]);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaTag('not json')).toThrow(TagParseError);
  });
});
