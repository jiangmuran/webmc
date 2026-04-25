import { describe, it, expect } from 'vitest';
import { parseVanillaGuiSpriteMcmeta, GuiSpriteMcmetaParseError } from './vanilla_gui_sprite_parse';

describe('vanilla GUI sprite scaling .mcmeta parser', () => {
  it('parses a nine_slice button frame', () => {
    const m = parseVanillaGuiSpriteMcmeta(
      JSON.stringify({
        gui: {
          scaling: {
            type: 'nine_slice',
            width: 200,
            height: 20,
            border: { left: 2, top: 2, right: 2, bottom: 2 },
          },
        },
      }),
    );
    expect(m.scalingType).toBe('nine_slice');
    expect(m.width).toBe(200);
    expect(m.height).toBe(20);
    expect(m.border).toEqual({ left: 2, top: 2, right: 2, bottom: 2 });
  });

  it('expands a numeric border into all four sides', () => {
    const m = parseVanillaGuiSpriteMcmeta(
      JSON.stringify({
        gui: { scaling: { type: 'nine_slice', width: 16, height: 16, border: 3 } },
      }),
    );
    expect(m.border).toEqual({ left: 3, top: 3, right: 3, bottom: 3 });
  });

  it('clamps unknown scaling type to "stretch"', () => {
    const m = parseVanillaGuiSpriteMcmeta(
      JSON.stringify({
        gui: { scaling: { type: 'magic', width: 10, height: 10 } },
      }),
    );
    expect(m.scalingType).toBe('stretch');
  });

  it('throws when gui.scaling is missing', () => {
    expect(() => parseVanillaGuiSpriteMcmeta('{}')).toThrow(GuiSpriteMcmetaParseError);
    expect(() => parseVanillaGuiSpriteMcmeta('{"gui":{}}')).toThrow(GuiSpriteMcmetaParseError);
  });
});
