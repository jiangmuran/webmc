import { describe, it, expect } from 'vitest';
import { result, emitsHissSound } from './lava_source_interact';

describe('lava source interact', () => {
  it('source lava + water = obsidian', () => {
    expect(
      result({
        lavaIsSource: true,
        waterIsSource: true,
        lavaTouchesAbove: false,
        waterTouchesSide: true,
      }),
    ).toBe('obsidian');
  });

  it('flowing lava + water source = stone', () => {
    expect(
      result({
        lavaIsSource: false,
        waterIsSource: true,
        lavaTouchesAbove: false,
        waterTouchesSide: false,
      }),
    ).toBe('stone');
  });

  it('flowing lava above flowing water = cobblestone', () => {
    expect(
      result({
        lavaIsSource: false,
        waterIsSource: false,
        lavaTouchesAbove: true,
        waterTouchesSide: true,
      }),
    ).toBe('cobblestone');
  });

  it('no interaction', () => {
    expect(
      result({
        lavaIsSource: false,
        waterIsSource: false,
        lavaTouchesAbove: false,
        waterTouchesSide: false,
      }),
    ).toBe('none');
  });

  it('hiss on any interaction', () => {
    expect(
      emitsHissSound({
        lavaIsSource: true,
        waterIsSource: true,
        lavaTouchesAbove: false,
        waterTouchesSide: true,
      }),
    ).toBe(true);
  });
});
