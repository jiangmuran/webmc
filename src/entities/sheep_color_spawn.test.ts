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

  it('low roll = white', () => {
    expect(rollSpawnColor(() => 0)).toBe('white');
  });
});
