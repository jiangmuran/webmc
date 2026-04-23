import { describe, it, expect } from 'vitest';
import { applyNew, tickDown } from './potion_effect_stack';

describe('potion effect stack', () => {
  it('adds new', () => {
    const r = applyNew([], { id: 'speed', amplifier: 0, durationTicks: 100 });
    expect(r).toHaveLength(1);
  });

  it('higher amp replaces', () => {
    const r = applyNew([{ id: 'speed', amplifier: 0, durationTicks: 100 }], {
      id: 'speed',
      amplifier: 1,
      durationTicks: 50,
    });
    expect(r[0]?.amplifier).toBe(1);
  });

  it('same amp longer duration replaces', () => {
    const r = applyNew([{ id: 'speed', amplifier: 0, durationTicks: 100 }], {
      id: 'speed',
      amplifier: 0,
      durationTicks: 200,
    });
    expect(r[0]?.durationTicks).toBe(200);
  });

  it('tick down expires', () => {
    const r = tickDown([{ id: 'speed', amplifier: 0, durationTicks: 1 }]);
    expect(r).toHaveLength(0);
  });
});
