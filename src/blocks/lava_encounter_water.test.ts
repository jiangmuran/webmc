import { describe, it, expect } from 'vitest';
import { lavaMeetsWater, lavaBurnsNeighbor } from './lava_encounter_water';

describe('lava/water interaction', () => {
  it('source+source → obsidian', () => {
    expect(lavaMeetsWater(true, true)).toBe('obsidian');
  });

  it('source lava + flowing water → obsidian (wiki: any water on lava source)', () => {
    expect(lavaMeetsWater(true, false)).toBe('obsidian');
  });

  it('flowing lava + source water → stone', () => {
    expect(lavaMeetsWater(false, true)).toBe('stone');
  });

  it('flowing lava + flowing water → cobblestone', () => {
    expect(lavaMeetsWater(false, false)).toBe('cobblestone');
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
