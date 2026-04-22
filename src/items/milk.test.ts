import { describe, it, expect } from 'vitest';
import { drinkMilk } from './milk';

describe('milk bucket', () => {
  it('clears all effects', () => {
    const p = {
      effects: new Map([
        ['poison', { amplifier: 0, remainingSec: 20 }],
        ['regeneration', { amplifier: 1, remainingSec: 45 }],
      ]),
    };
    const r = drinkMilk(p);
    expect(r.clearedCount).toBe(2);
    expect(p.effects.size).toBe(0);
  });

  it('always returns an empty bucket', () => {
    const p = { effects: new Map() };
    expect(drinkMilk(p).returnsBucket).toBe(true);
  });
});
