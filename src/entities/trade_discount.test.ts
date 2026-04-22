import { describe, it, expect } from 'vitest';
import {
  adjustedPrice,
  canTrade,
  recordTrade,
  restockIfDue,
  RESTOCK_INTERVAL_TICKS,
} from './trade_discount';

describe('trade discount', () => {
  it('no effects = base', () => {
    expect(
      adjustedPrice(10, {
        heroOfVillageLevel: 0,
        heroBonusTrade: false,
        curedByThisPlayer: false,
        gossipScore: 0,
      }),
    ).toBe(10);
  });

  it('hero 1 = 30% off', () => {
    expect(
      adjustedPrice(10, {
        heroOfVillageLevel: 1,
        heroBonusTrade: false,
        curedByThisPlayer: false,
        gossipScore: 0,
      }),
    ).toBe(7);
  });

  it('cured by player = large discount', () => {
    expect(
      adjustedPrice(10, {
        heroOfVillageLevel: 0,
        heroBonusTrade: false,
        curedByThisPlayer: true,
        gossipScore: 0,
      }),
    ).toBe(5);
  });

  it('gossip affects price', () => {
    expect(
      adjustedPrice(10, {
        heroOfVillageLevel: 0,
        heroBonusTrade: false,
        curedByThisPlayer: false,
        gossipScore: 200,
      }),
    ).toBe(8);
  });

  it('floor at 1', () => {
    expect(
      adjustedPrice(2, {
        heroOfVillageLevel: 5,
        heroBonusTrade: false,
        curedByThisPlayer: true,
        gossipScore: 700,
      }),
    ).toBe(1);
  });
});

describe('trade lock', () => {
  it('lock after maxUses', () => {
    const t = { maxUses: 2, usesToday: 0, lockedTick: null as number | null };
    expect(canTrade(t)).toBe(true);
    recordTrade(t, 10);
    recordTrade(t, 20);
    expect(canTrade(t)).toBe(false);
    expect(t.lockedTick).toBe(20);
  });

  it('restock after interval', () => {
    const t = { maxUses: 1, usesToday: 1, lockedTick: 0 };
    expect(restockIfDue(t, RESTOCK_INTERVAL_TICKS - 1)).toBe(false);
    expect(restockIfDue(t, RESTOCK_INTERVAL_TICKS)).toBe(true);
    expect(t.usesToday).toBe(0);
  });
});
