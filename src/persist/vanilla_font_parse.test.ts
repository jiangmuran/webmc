import { describe, it, expect } from 'vitest';
import { parseVanillaFont, FontParseError } from './vanilla_font_parse';

describe('vanilla font parser', () => {
  it('parses a default-style font with multiple providers', () => {
    const f = parseVanillaFont(
      JSON.stringify({
        providers: [
          { type: 'bitmap', file: 'minecraft:font/ascii.png', ascent: 7, chars: ['abc'] },
          { type: 'ttf', file: 'minecraft:font/inter.ttf', size: 16, shift: [0, 1] },
          { type: 'space', advances: { ' ': 4 } },
          { type: 'legacy_unicode', sizes: 'minecraft:font/glyph_sizes.bin', template: 'a' },
          { type: 'reference', id: 'minecraft:default' },
        ],
      }),
    );
    expect(f.providers.map((p) => p.type)).toEqual([
      'bitmap',
      'ttf',
      'space',
      'legacy_unicode',
      'reference',
    ]);
    expect(f.providers[0]?.raw['ascent']).toBe(7);
  });

  it('marks unknown provider type', () => {
    const f = parseVanillaFont(JSON.stringify({ providers: [{ type: 'mymod:custom' }] }));
    expect(f.providers[0]?.type).toBe('unknown');
  });

  it('returns empty when providers missing', () => {
    expect(parseVanillaFont('{}').providers).toEqual([]);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaFont('not json')).toThrow(FontParseError);
  });
});
