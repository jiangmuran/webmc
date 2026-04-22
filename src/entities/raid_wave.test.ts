import { describe, it, expect } from 'vitest';
import { wavesForOmenLevel, waveComposition, isFinalWave } from './raid_wave';

describe('raid waves', () => {
  it('peaceful = 0', () => {
    expect(wavesForOmenLevel(1, 'peaceful')).toBe(0);
  });

  it('hard is more than easy', () => {
    expect(wavesForOmenLevel(1, 'hard')).toBeGreaterThan(wavesForOmenLevel(1, 'easy'));
  });

  it('omen scales waves', () => {
    expect(wavesForOmenLevel(5, 'normal')).toBeGreaterThan(wavesForOmenLevel(0, 'normal'));
  });

  it('composition grows with wave index', () => {
    const a = waveComposition(0, 'normal');
    const b = waveComposition(4, 'normal');
    expect(b.pillagers).toBeGreaterThan(a.pillagers);
    expect(b.ravagers).toBeGreaterThan(a.ravagers);
  });

  it('no ravagers before wave 4', () => {
    expect(waveComposition(3, 'hard').ravagers).toBe(0);
    expect(waveComposition(4, 'hard').ravagers).toBe(1);
  });

  it('final wave detection', () => {
    expect(isFinalWave(4, 5)).toBe(true);
    expect(isFinalWave(2, 5)).toBe(false);
  });
});
