import { describe, it, expect } from 'vitest';
import { DYE_RGB, mixLeatherDye, washLeatherInCauldron } from './cauldron_dye';

describe('cauldron dye', () => {
  it('default leather when no dyes', () => {
    const c = mixLeatherDye({ currentColor: null, addedDyes: [] });
    expect(c).toEqual([160, 101, 64]);
  });

  it('single dye applies', () => {
    const c = mixLeatherDye({ currentColor: null, addedDyes: ['red'] });
    expect(c[0]).toBeGreaterThan(c[1]);
    expect(c[0]).toBeGreaterThan(c[2]);
  });

  it('mixing red + blue yields purple-ish', () => {
    const c = mixLeatherDye({ currentColor: null, addedDyes: ['red', 'blue'] });
    expect(c[1]).toBeLessThan(c[0]);
    expect(c[1]).toBeLessThan(c[2]);
  });

  it('wash in water cauldron removes color', () => {
    const r = washLeatherInCauldron({
      cauldron: { contents: 'water', level: 2 },
      itemHasColor: true,
    });
    expect(r.washed).toBe(true);
    expect(r.cauldronLevelAfter).toBe(1);
  });

  it('empty cauldron = no wash', () => {
    const r = washLeatherInCauldron({
      cauldron: { contents: 'empty', level: 0 },
      itemHasColor: true,
    });
    expect(r.washed).toBe(false);
  });

  it('uncolored item = no wash', () => {
    const r = washLeatherInCauldron({
      cauldron: { contents: 'water', level: 2 },
      itemHasColor: false,
    });
    expect(r.washed).toBe(false);
  });

  it('table includes 16 colors', () => {
    expect(Object.keys(DYE_RGB).length).toBe(16);
  });
});
