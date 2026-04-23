import { describe, it, expect } from 'vitest';
import { arrowEffectDuration, combinedSpec, isInstant } from './arrow_tipped_effects';

describe('arrow tipped effects', () => {
  it('duration 1/8 of potion', () => {
    expect(arrowEffectDuration(800)).toBe(100);
  });

  it('min 1 tick', () => {
    expect(arrowEffectDuration(0)).toBe(1);
  });

  it('combined adds', () => {
    const r = combinedSpec(
      { effects: [{ id: 'poison', durationTicks: 100, amplifier: 0 }] },
      { effects: [{ id: 'slowness', durationTicks: 100, amplifier: 0 }] },
    );
    expect(r.effects).toHaveLength(2);
  });

  it('instant detection', () => {
    expect(isInstant({ id: 'instant_health' })).toBe(true);
    expect(isInstant({ id: 'poison' })).toBe(false);
  });
});
