import { describe, it, expect } from 'vitest';
import {
  parseVanillaPaintingVariant,
  PaintingVariantParseError,
} from './vanilla_painting_variant_parse';

describe('vanilla painting_variant parser', () => {
  it('parses a typical painting variant', () => {
    const p = parseVanillaPaintingVariant(
      JSON.stringify({
        asset_id: 'minecraft:bust',
        width: 2,
        height: 2,
        title: { translate: 'painting.minecraft.bust.title' },
        author: 'Kristoffer Zetterstrand',
      }),
    );
    expect(p.assetId).toBe('webmc:bust');
    expect(p.width).toBe(2);
    expect(p.height).toBe(2);
    expect(p.title).toBe('painting.minecraft.bust.title');
    expect(p.author).toBe('Kristoffer Zetterstrand');
  });

  it('falls back to defaults when fields missing', () => {
    const p = parseVanillaPaintingVariant('{}');
    expect(p.assetId).toBe('');
    expect(p.width).toBe(1);
    expect(p.height).toBe(1);
    expect(p.title).toBe('');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaPaintingVariant('nope')).toThrow(PaintingVariantParseError);
  });
});
