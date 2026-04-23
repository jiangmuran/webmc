import { describe, it, expect } from 'vitest';
import { makeWave, totalRaiders, WAVES_BY_DIFFICULTY } from './raid_wave_counts';

describe('raid wave counts', () => {
  it('wave 1 has pillagers', () => {
    expect(makeWave(1, 'normal').pillager).toBeGreaterThan(0);
  });

  it('evoker unlocks at 3', () => {
    expect(makeWave(2, 'normal').evoker).toBe(0);
    expect(makeWave(3, 'normal').evoker).toBe(1);
  });

  it('hard adds vindicators', () => {
    expect(makeWave(1, 'hard').vindicator).toBeGreaterThan(makeWave(1, 'normal').vindicator);
  });

  it('easy reduces pillagers', () => {
    expect(makeWave(2, 'easy').pillager).toBeLessThanOrEqual(makeWave(2, 'normal').pillager);
  });

  it('total sums', () => {
    const w = makeWave(5, 'hard');
    expect(totalRaiders(w)).toBe(w.pillager + w.vindicator + w.evoker + w.witch + w.ravager);
  });

  it('hard most waves', () => {
    expect(WAVES_BY_DIFFICULTY.hard).toBeGreaterThan(WAVES_BY_DIFFICULTY.easy);
  });
});
