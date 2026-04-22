import { describe, it, expect } from 'vitest';
import { biteCake, comparatorSignal, extinguishCandle, igniteCandle, makeCake } from './cake';

class Eater {
  hunger = 0;
  cap = 20;
  eat(h: number): boolean {
    if (this.hunger >= this.cap) return false;
    this.hunger += h;
    return true;
  }
}

describe('cake', () => {
  it('7 bites consume the cake', () => {
    const c = makeCake();
    const e = new Eater();
    let consumed = false;
    for (let i = 0; i < 7; i++) {
      const r = biteCake(c, e);
      if (r.consumed) consumed = true;
    }
    expect(consumed).toBe(true);
  });

  it('lit candle blocks eating', () => {
    const c = makeCake('white');
    igniteCandle(c);
    const e = new Eater();
    const r = biteCake(c, e);
    expect(r.ateBite).toBe(false);
  });

  it('first bite pops the candle off an unlit candle-cake', () => {
    const c = makeCake('white');
    const e = new Eater();
    biteCake(c, e);
    expect(c.candle).toBeNull();
  });

  it('comparator signal decreases with bites', () => {
    const c = makeCake();
    const full = comparatorSignal(c);
    const e = new Eater();
    biteCake(c, e);
    expect(comparatorSignal(c)).toBeLessThan(full);
  });

  it('ignite/extinguish candle', () => {
    const c = makeCake('red');
    expect(igniteCandle(c)).toBe(true);
    expect(igniteCandle(c)).toBe(false); // already lit
    expect(extinguishCandle(c)).toBe(true);
    expect(extinguishCandle(c)).toBe(false);
  });

  it('full hunger player still rejects bite (eat returns false)', () => {
    const c = makeCake();
    const e = new Eater();
    e.hunger = 20;
    const r = biteCake(c, e);
    expect(r.ateBite).toBe(false);
  });
});
