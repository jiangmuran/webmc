import { describe, it, expect } from 'vitest';
import { lavaMeetsWater, lavaBurnsNeighbor } from './lava_encounter_water';

describe('lava/water interaction', () => {
  it('source+source → obsidian', () => {
    expect(lavaMeetsWater(true, true)).toBe('obsidian');
  });

  it('source lava + flowing water → obsidian (wiki: any water on lava source)', () => {
    expect(lavaMeetsWater(true, false)).toBe('obsidian');
  });

  it('flowing lava + source water (horizontal) → cobblestone (wiki)', () => {
    // Wiki minecraft.wiki/w/Cobblestone: "When water and flowing
    // lava come into contact, the flowing lava is replaced by
    // cobblestone." This is the classic cobble-generator default.
    expect(lavaMeetsWater(false, true)).toBe('cobblestone');
  });

  it('flowing lava + flowing water → cobblestone', () => {
    expect(lavaMeetsWater(false, false)).toBe('cobblestone');
  });

  it('flowing lava FROM ABOVE onto water → stone (wiki)', () => {
    // Wiki: "if the lava flows on top of the water from above, stone
    // is created instead." Vertical-flow case only.
    expect(lavaMeetsWater(false, true, true)).toBe('stone');
    expect(lavaMeetsWater(false, false, true)).toBe('stone');
  });

  it('no lava no burn', () => {
    expect(lavaBurnsNeighbor('oak_log', 0, () => 0.01)).toBe(false);
  });

  it('burns flammable', () => {
    expect(lavaBurnsNeighbor('oak_log', 1, () => 0.01)).toBe(true);
  });

  it('stone safe', () => {
    expect(lavaBurnsNeighbor('stone', 4, () => 0.01)).toBe(false);
  });
});
