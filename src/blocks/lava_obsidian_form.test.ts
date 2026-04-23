import { describe, it, expect } from 'vitest';
import { form, sizzleSound } from './lava_obsidian_form';

const base = {
  hereIsLavaSource: false,
  hereIsLavaFlow: false,
  hereIsWaterFlow: false,
  hereIsWaterSource: false,
  neighborWaterFlow: false,
  neighborLavaSource: false,
  neighborWaterSource: false,
};

describe('lava obsidian form', () => {
  it('lava source + water flow → obsidian', () => {
    expect(form({ ...base, hereIsLavaSource: true, neighborWaterFlow: true })).toBe('obsidian');
  });

  it('flowing mix → cobblestone', () => {
    expect(form({ ...base, hereIsLavaFlow: true, hereIsWaterFlow: true })).toBe('cobblestone');
  });

  it('lava flow over water → stone', () => {
    expect(form({ ...base, hereIsLavaFlow: true, neighborWaterFlow: true })).toBe('stone');
  });

  it('no reaction', () => {
    expect(form(base)).toBe('none');
  });

  it('sizzles on any reaction', () => {
    expect(sizzleSound('obsidian')).toBe(true);
    expect(sizzleSound('none')).toBe(false);
  });
});
