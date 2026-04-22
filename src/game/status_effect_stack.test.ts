import { describe, it, expect } from 'vitest';
import { makeActive, addEffect, topEffect, tickEffects } from './status_effect_stack';

describe('status effect stacking', () => {
  it('add then upgrade', () => {
    const a = makeActive();
    expect(addEffect(a, { id: 'speed', amplifier: 0, durationTicks: 100, source: 'potion' })).toBe(
      'upgraded',
    );
    expect(addEffect(a, { id: 'speed', amplifier: 1, durationTicks: 100, source: 'potion' })).toBe(
      'upgraded',
    );
    expect(topEffect(a, 'speed')?.amplifier).toBe(1);
  });

  it('same amp same source merges duration', () => {
    const a = makeActive();
    addEffect(a, { id: 'speed', amplifier: 0, durationTicks: 100, source: 'potion' });
    expect(addEffect(a, { id: 'speed', amplifier: 0, durationTicks: 200, source: 'potion' })).toBe(
      'merged_duration',
    );
    expect(topEffect(a, 'speed')?.durationTicks).toBe(200);
  });

  it('lower amp added but hidden', () => {
    const a = makeActive();
    addEffect(a, { id: 'speed', amplifier: 2, durationTicks: 100, source: 'potion' });
    addEffect(a, { id: 'speed', amplifier: 0, durationTicks: 100, source: 'beacon' });
    expect(topEffect(a, 'speed')?.amplifier).toBe(2);
  });

  it('tick removes expired', () => {
    const a = makeActive();
    addEffect(a, { id: 'speed', amplifier: 0, durationTicks: 5, source: 'potion' });
    tickEffects(a, 10);
    expect(topEffect(a, 'speed')).toBeNull();
  });
});
