import { describe, it, expect } from 'vitest';
import { countEmeralds, canAfford, consumeEmeralds, type Slot } from './emerald_trade_count';

function mk(): Slot[] {
  return [
    { id: 'emerald', count: 30 },
    { id: 'dirt', count: 64 },
    { id: 'emerald', count: 10 },
  ];
}

describe('emerald trade count', () => {
  it('counts across slots', () => {
    expect(countEmeralds(mk())).toBe(40);
  });

  it('canAfford threshold', () => {
    expect(canAfford(mk(), 25)).toBe(true);
    expect(canAfford(mk(), 100)).toBe(false);
  });

  it('consume across stacks', () => {
    const s = mk();
    expect(consumeEmeralds(s, 35)).toBe(true);
    expect(countEmeralds(s)).toBe(5);
  });

  it('consume exhausts + cleans id', () => {
    const s = mk();
    consumeEmeralds(s, 30);
    expect(s[0]?.id).toBeNull();
  });

  it('consume rejects insufficient', () => {
    const s = mk();
    expect(consumeEmeralds(s, 100)).toBe(false);
    expect(countEmeralds(s)).toBe(40);
  });
});
