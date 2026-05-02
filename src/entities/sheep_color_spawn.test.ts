import { describe, it, expect } from 'vitest';
import { rollSpawnColor, dyeWithDye, breedColorFromParents } from './sheep_color_spawn';

describe('sheep color spawn', () => {
  it('mostly white', () => {
    let whites = 0;
    for (let i = 0; i < 500; i++) if (rollSpawnColor(Math.random) === 'white') whites++;
    expect(whites).toBeGreaterThan(300);
  });

  it('dye replaces', () => {
    expect(dyeWithDye('red')).toBe('red');
  });

  it('same parents pass color', () => {
    expect(breedColorFromParents('red', 'red')).toBe('red');
  });

  it('mixable parents produce wiki dye-mix offspring', () => {
    // minecraft.wiki/w/Sheep#Breeding: blue + yellow → green;
    // black + white → gray; red + yellow → orange.
    expect(breedColorFromParents('blue', 'yellow')).toBe('green');
    expect(breedColorFromParents('black', 'white')).toBe('gray');
    expect(breedColorFromParents('red', 'yellow')).toBe('orange');
  });

  it('non-mixable parents pick random parent color', () => {
    // No dye mix for 'pink'+'cyan' — wiki says random parent color.
    expect(breedColorFromParents('pink', 'cyan', () => 0)).toBe('pink');
    expect(breedColorFromParents('pink', 'cyan', () => 0.99)).toBe('cyan');
  });

  it('low roll = white', () => {
    expect(rollSpawnColor(() => 0)).toBe('white');
  });
});
