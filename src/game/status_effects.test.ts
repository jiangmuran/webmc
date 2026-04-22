import { describe, it, expect } from 'vitest';
import {
  defOf,
  EFFECTS,
  isBeneficial,
  isHarmful,
  milkClearable,
  stackEffects,
} from './status_effects';

describe('status effects', () => {
  it('speed is beneficial', () => {
    expect(isBeneficial('speed')).toBe(true);
    expect(isHarmful('speed')).toBe(false);
  });

  it('poison is harmful', () => {
    expect(isHarmful('poison')).toBe(true);
  });

  it('bad_omen is neutral', () => {
    expect(defOf('bad_omen')?.category).toBe('neutral');
  });

  it('instant_health is flagged instant', () => {
    expect(EFFECTS['instant_health']?.instant).toBe(true);
  });

  it('unknown effect returns null def', () => {
    expect(defOf('xyz')).toBeNull();
  });

  it('milk cannot clear instant effects', () => {
    expect(milkClearable('instant_damage')).toBe(false);
    expect(milkClearable('poison')).toBe(true);
  });

  it('stack picks higher amplifier', () => {
    const r = stackEffects({ amplifier: 1, durationSec: 100 }, { amplifier: 2, durationSec: 50 });
    expect(r.amplifier).toBe(2);
    expect(r.durationSec).toBe(50);
  });

  it('stack sums duration when amplifier equal (picks max)', () => {
    const r = stackEffects({ amplifier: 1, durationSec: 100 }, { amplifier: 1, durationSec: 200 });
    expect(r.durationSec).toBe(200);
  });

  it('1.21 wind_charged exists', () => {
    expect(defOf('wind_charged')).not.toBeNull();
  });
});
