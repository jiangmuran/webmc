import { describe, it, expect } from 'vitest';
import { makeTraderState, tickTrader } from './trader_invisibility';

describe('wandering trader invisibility', () => {
  it('drinks invisibility at night', () => {
    const t = makeTraderState();
    const r = tickTrader(t, { timeOfDay: 15000, dtSec: 0.1 });
    expect(r.drinksInvisibility).toBe(true);
    expect(t.invisible).toBe(true);
  });

  it('drinks milk at sunrise', () => {
    const t = makeTraderState();
    t.invisible = true;
    const r = tickTrader(t, { timeOfDay: 1000, dtSec: 10 });
    expect(r.drinksMilk).toBe(true);
    expect(t.invisible).toBe(false);
  });

  it('cooldown prevents spam', () => {
    const t = makeTraderState();
    tickTrader(t, { timeOfDay: 15000, dtSec: 0.1 });
    const r = tickTrader(t, { timeOfDay: 15000, dtSec: 0.1 });
    expect(r.drinksInvisibility).toBe(false);
  });
});
