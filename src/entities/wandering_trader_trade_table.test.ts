import { describe, it, expect } from 'vitest';
import { canTrade, afterTrade, COMMON_TRADES, RARE_TRADES } from './wandering_trader_trade_table';

describe('wandering trader trade table', () => {
  it('fresh trade usable', () => {
    const first = COMMON_TRADES[0];
    expect(first).toBeDefined();
    if (first) expect(canTrade(first)).toBe(true);
  });

  it('uses increment', () => {
    const first = COMMON_TRADES[0];
    expect(first).toBeDefined();
    if (first) expect(afterTrade(first).uses).toBe(1);
  });

  it('maxed cannot trade', () => {
    const maxed = { buy: 'emerald', buyCount: 1, sell: 'x', sellCount: 1, uses: 10, maxUses: 10 };
    expect(canTrade(maxed)).toBe(false);
    expect(afterTrade(maxed)).toBe(maxed);
  });

  it('rare offers fewer uses', () => {
    const rareFirst = RARE_TRADES[0];
    expect(rareFirst).toBeDefined();
    if (rareFirst) expect(rareFirst.maxUses).toBeLessThan(10);
  });
});
