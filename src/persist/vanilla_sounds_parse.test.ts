import { describe, it, expect } from 'vitest';
import { parseVanillaSoundsJson, SoundsParseError } from './vanilla_sounds_parse';

describe('vanilla sounds.json parser', () => {
  it('parses a typical block break event with mixed variant forms', () => {
    const s = parseVanillaSoundsJson(
      JSON.stringify({
        'block.stone.break': {
          category: 'block',
          subtitle: 'subtitles.block.generic.break',
          sounds: [
            'block/stone/break1',
            { name: 'minecraft:block/stone/break2', volume: 0.8, pitch: 1.1, weight: 2 },
          ],
        },
      }),
    );
    const ev = s.events['block.stone.break'];
    expect(ev?.category).toBe('block');
    expect(ev?.subtitle).toBe('subtitles.block.generic.break');
    expect(ev?.variants.length).toBe(2);
    expect(ev?.variants[0]?.name).toBe('webmc:block/stone/break1');
    expect(ev?.variants[1]).toEqual({
      name: 'webmc:block/stone/break2',
      volume: 0.8,
      pitch: 1.1,
      weight: 2,
      stream: false,
    });
  });

  it('honors replace: true', () => {
    const s = parseVanillaSoundsJson(
      JSON.stringify({
        'music.menu': { category: 'music', replace: true, sounds: ['music/menu'] },
      }),
    );
    expect(s.events['music.menu']?.replace).toBe(true);
  });

  it('treats stream:true correctly', () => {
    const s = parseVanillaSoundsJson(
      JSON.stringify({
        'music.creative': { sounds: [{ name: 'music/creative', stream: true }] },
      }),
    );
    expect(s.events['music.creative']?.variants[0]?.stream).toBe(true);
  });

  it('falls back to defaults for missing fields', () => {
    const s = parseVanillaSoundsJson(JSON.stringify({ 'noop.evt': {} }));
    const ev = s.events['noop.evt'];
    expect(ev?.category).toBe('master');
    expect(ev?.subtitle).toBeNull();
    expect(ev?.variants).toEqual([]);
    expect(ev?.replace).toBe(false);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaSoundsJson('not json')).toThrow(SoundsParseError);
  });
});
