import { describe, it, expect } from 'vitest';
import { parseVanillaBannerPattern, BannerPatternParseError } from './vanilla_banner_pattern_parse';

describe('vanilla banner_pattern parser', () => {
  it('parses a typical banner pattern', () => {
    const b = parseVanillaBannerPattern(
      JSON.stringify({
        asset_id: 'minecraft:bricks',
        translation_key: 'block.minecraft.banner.bricks',
      }),
    );
    expect(b.assetId).toBe('webmc:bricks');
    expect(b.translationKey).toBe('block.minecraft.banner.bricks');
  });

  it('falls back when fields missing', () => {
    const b = parseVanillaBannerPattern('{}');
    expect(b.assetId).toBe('');
    expect(b.translationKey).toBe('');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaBannerPattern('nope')).toThrow(BannerPatternParseError);
  });
});
