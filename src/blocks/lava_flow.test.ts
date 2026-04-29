import { describe, it, expect } from 'vitest';
import { lavaSpread, interact, LAVA_FIRE_RADIUS } from './lava_flow';

describe('lava flow', () => {
  it('spread shorter in overworld', () => {
    expect(lavaSpread('overworld')).toBeLessThan(lavaSpread('nether'));
  });

  it('lava source + water flow = obsidian', () => {
    const r = interact({
      source: 'lava',
      sourceIsStill: true,
      other: 'water',
      otherIsStill: false,
    });
    expect(r.kind).toBe('obsidian');
  });

  it('lava flow + water source = stone (wiki)', () => {
    expect(
      interact({
        source: 'lava',
        sourceIsStill: false,
        other: 'water',
        otherIsStill: true,
      }).kind,
    ).toBe('stone');
  });

  it('lava flow + flowing water = cobblestone', () => {
    expect(
      interact({
        source: 'lava',
        sourceIsStill: false,
        other: 'water',
        otherIsStill: false,
      }).kind,
    ).toBe('cobblestone');
  });

  it('water + lava source = obsidian', () => {
    expect(
      interact({ source: 'water', sourceIsStill: false, other: 'lava', otherIsStill: true }).kind,
    ).toBe('obsidian');
  });

  it('basalt from blue ice', () => {
    expect(
      interact({ source: 'lava', sourceIsStill: true, other: 'blue_ice', otherIsStill: true }).kind,
    ).toBe('basalt');
  });

  it('no reaction on nothing', () => {
    expect(
      interact({ source: 'lava', sourceIsStill: true, other: null, otherIsStill: true }).kind,
    ).toBe('none');
  });

  it('fire radius set', () => {
    expect(LAVA_FIRE_RADIUS).toBeGreaterThan(0);
  });
});
