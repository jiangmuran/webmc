import { describe, it, expect } from 'vitest';
import {
  pickPoolKey,
  pickTrack,
  nextGapTicks,
  MIN_GAP_TICKS,
  MAX_GAP_TICKS,
} from './biome_music_select';

describe('music select', () => {
  it('end boss', () => {
    expect(pickPoolKey({ dim: 'end', biome: 'any', isBoss: true })).toBe('end_boss');
  });

  it('nether warped', () => {
    expect(pickPoolKey({ dim: 'nether', biome: 'warped_forest', isBoss: false })).toBe(
      'nether_warped',
    );
  });

  it('overworld deep dark', () => {
    expect(pickPoolKey({ dim: 'overworld', biome: 'deep_dark', isBoss: false })).toBe('deep_dark');
  });

  it('pick track returns string', () => {
    const t = pickTrack({ dim: 'overworld', biome: 'plains', isBoss: false }, () => 0);
    expect(typeof t).toBe('string');
  });

  it('gap within bounds', () => {
    for (let i = 0; i < 50; i++) {
      const g = nextGapTicks(() => i / 50);
      expect(g).toBeGreaterThanOrEqual(MIN_GAP_TICKS);
      expect(g).toBeLessThanOrEqual(MAX_GAP_TICKS);
    }
  });
});
