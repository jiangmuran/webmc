import { describe, it, expect } from 'vitest';
import {
  finalFirstInputCount,
  availableToTrade,
  consumeUse,
  restockUses,
  type TradeOffer,
} from './villager_trade_offer';

function mk(): TradeOffer {
  return {
    inputs: [{ id: 'emerald', count: 10 }],
    result: { id: 'diamond', count: 1 },
    usesLeft: 12,
    maxUses: 12,
    priceMultiplier: 0,
    demand: 0,
    specialPrice: 0,
  };
}

describe('villager trade offer', () => {
  it('hero discount lowers price', () => {
    const base = finalFirstInputCount(mk(), 0, 0);
    const hero = finalFirstInputCount(mk(), 1, 0);
    expect(hero).toBeLessThan(base);
  });

  it('demand raises price', () => {
    const o = { ...mk(), demand: 10 };
    const raised = finalFirstInputCount(o, 0, 0);
    expect(raised).toBeGreaterThan(finalFirstInputCount(mk(), 0, 0));
  });

  it('reputation discounts', () => {
    const base = finalFirstInputCount(mk(), 0, 0);
    const good = finalFirstInputCount(mk(), 0, 50);
    expect(good).toBeLessThanOrEqual(base);
  });

  it('consume decrements uses', () => {
    const o = consumeUse(mk());
    expect(o.usesLeft).toBe(11);
    expect(o.demand).toBe(1);
  });

  it('restock resets', () => {
    const o = restockUses({ ...mk(), usesLeft: 0, demand: 5 });
    expect(o.usesLeft).toBe(12);
    expect(o.demand).toBe(3);
  });

  it('availableToTrade gated by uses', () => {
    expect(availableToTrade(mk())).toBe(true);
    expect(availableToTrade({ ...mk(), usesLeft: 0 })).toBe(false);
  });

  it('min price floor 1', () => {
    const cheap = finalFirstInputCount({ ...mk(), inputs: [{ id: 'emerald', count: 1 }] }, 3, 100);
    expect(cheap).toBeGreaterThanOrEqual(1);
  });
});
