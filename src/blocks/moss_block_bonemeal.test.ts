import { describe, it, expect } from 'vitest';
import { canConvert, convertedBlock, azaleaSpawnChance, MOSS_RADIUS } from './moss_block_bonemeal';

describe('moss block bonemeal', () => {
  it('converts stone', () => {
    expect(canConvert('stone')).toBe(true);
  });

  it('does not convert obsidian', () => {
    expect(canConvert('obsidian')).toBe(false);
  });

  it('turns into moss', () => {
    expect(convertedBlock()).toBe('moss_block');
  });

  it('azalea spawn 0 < p < 1', () => {
    const p = azaleaSpawnChance();
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(1);
  });

  it('radius positive', () => {
    expect(MOSS_RADIUS).toBeGreaterThan(0);
  });
});
