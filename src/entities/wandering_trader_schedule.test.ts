import { describe, it, expect } from 'vitest';
import {
  makeTimer,
  tick,
  llamaCompanionCount,
  TRADER_CHECK_INTERVAL_TICKS,
  TRADER_LIFETIME_TICKS,
} from './wandering_trader_schedule';

describe('wandering trader schedule', () => {
  it('timer starts with interval', () => {
    expect(makeTimer().ticksUntilNextCheck).toBe(TRADER_CHECK_INTERVAL_TICKS);
  });

  it('tick decrements until check', () => {
    const t = tick(makeTimer(), 0, () => 0, false);
    expect(t.ticksUntilNextCheck).toBeLessThan(TRADER_CHECK_INTERVAL_TICKS);
  });

  it('spawns on lucky roll at check', () => {
    const t = tick({ ticksUntilNextCheck: 0, activeTrader: null }, 0, () => 0, true);
    expect(t.activeTrader).not.toBeNull();
  });

  it('despawns after lifetime', () => {
    const t = tick(
      { ticksUntilNextCheck: 500, activeTrader: { spawnedAtTick: 0 } },
      TRADER_LIFETIME_TICKS,
      () => 0,
      true,
    );
    expect(t.activeTrader).toBeNull();
  });

  it('2 llamas', () => {
    expect(llamaCompanionCount()).toBe(2);
  });
});
