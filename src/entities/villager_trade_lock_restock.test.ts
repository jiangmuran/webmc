import { describe, it, expect } from 'vitest';
import {
  tradeIsLocked,
  anyLocked,
  tryRestock,
  onNewDay,
  RESTOCK_COOLDOWN_MS,
  MAX_RESTOCKS_PER_DAY,
  type Villager,
} from './villager_trade_lock_restock';

function v(used: number, max: number): Villager {
  return {
    trades: [
      {
        inputs: [],
        output: { id: 'x', count: 1 },
        maxUses: max,
        uses: used,
        priceMultiplier: 0,
        experienceReward: 0,
      },
    ],
    lastRestockMs: -Infinity,
    restocksToday: 0,
    workAtMs: 0,
  };
}

describe('villager restock', () => {
  it('lock detection', () => {
    expect(tradeIsLocked(v(4, 4).trades[0] as never)).toBe(true);
    expect(tradeIsLocked(v(0, 4).trades[0] as never)).toBe(false);
  });

  it('anyLocked', () => {
    expect(anyLocked(v(4, 4))).toBe(true);
  });

  it('requires workstation', () => {
    const vl = v(4, 4);
    expect(tryRestock(vl, { nowMs: 0, villagerAtWorkstation: false })).toBe('no_workstation');
  });

  it('cooldown', () => {
    const vl = v(4, 4);
    tryRestock(vl, { nowMs: 0, villagerAtWorkstation: true });
    expect(tryRestock(vl, { nowMs: 100, villagerAtWorkstation: true })).toBe('cooldown');
  });

  it('cap', () => {
    const vl = v(4, 4);
    for (let i = 0; i < MAX_RESTOCKS_PER_DAY; i++) {
      if (vl.trades[0]) vl.trades[0].uses = 4;
      tryRestock(vl, { nowMs: i * RESTOCK_COOLDOWN_MS * 2, villagerAtWorkstation: true });
    }
    if (vl.trades[0]) vl.trades[0].uses = 4;
    expect(
      tryRestock(vl, {
        nowMs: 1000000,
        villagerAtWorkstation: true,
      }),
    ).toBe('cap');
  });

  it('new day resets', () => {
    const vl = v(4, 4);
    vl.restocksToday = 2;
    onNewDay(vl);
    expect(vl.restocksToday).toBe(0);
  });
});
