import { describe, it, expect } from 'vitest';
import { pickTrack, nextInterval, MIN_INTERVAL_MS, MAX_INTERVAL_MS } from './music_biome_track';

describe('music biome track', () => {
  it('overworld day track', () => {
    expect(pickTrack('overworld_day', () => 0)).toContain('music.overworld.calm');
  });

  it('nether different from overworld', () => {
    expect(pickTrack('nether', () => 0)).toContain('nether');
  });

  it('end boss single track', () => {
    expect(pickTrack('end_boss', () => 0.9)).toBe('music.end.boss_fight');
  });

  it('menu uses menu tracks', () => {
    expect(pickTrack('menu', () => 0)).toContain('menu');
  });

  it('interval within range', () => {
    const t = nextInterval(() => 0.5);
    expect(t).toBeGreaterThanOrEqual(MIN_INTERVAL_MS);
    expect(t).toBeLessThan(MAX_INTERVAL_MS);
  });
});
