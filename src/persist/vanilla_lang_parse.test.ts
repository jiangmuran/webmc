import { describe, it, expect } from 'vitest';
import { parseVanillaLang, translate, LangParseError } from './vanilla_lang_parse';

describe('vanilla lang parser', () => {
  it('parses a small en_us.json', () => {
    const l = parseVanillaLang(
      JSON.stringify({
        'block.minecraft.stone': 'Stone',
        'block.minecraft.dirt': 'Dirt',
        'item.minecraft.diamond': 'Diamond',
        'gui.done': 'Done',
      }),
    );
    expect(l.entries['block.minecraft.stone']).toBe('Stone');
    expect(l.entries['item.minecraft.diamond']).toBe('Diamond');
    expect(l.topLevelPrefixCount).toBe(3); // block, item, gui
  });

  it('skips non-string values', () => {
    const l = parseVanillaLang(
      JSON.stringify({
        'block.stone': 'Stone',
        'block.bad': 42,
        'block.also_bad': null,
      }),
    );
    expect(Object.keys(l.entries)).toEqual(['block.stone']);
  });

  it('translate falls back to key when missing', () => {
    const l = parseVanillaLang(JSON.stringify({ 'gui.done': 'Done' }));
    expect(translate(l, 'gui.done')).toBe('Done');
    expect(translate(l, 'gui.cancel')).toBe('gui.cancel');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaLang('not json')).toThrow(LangParseError);
  });

  it('returns empty lang for empty object', () => {
    const l = parseVanillaLang('{}');
    expect(l.entries).toEqual({});
    expect(l.topLevelPrefixCount).toBe(0);
  });
});
