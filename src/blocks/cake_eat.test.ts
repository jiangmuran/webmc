import { describe, it, expect } from 'vitest';
import { makeCake, eat, extinguishCandleOnCake, FRESH_BITES, BITE_HUNGER } from './cake_eat';

describe('cake', () => {
  it('gives hunger per bite', () => {
    const c = makeCake();
    const r = eat(c, 10);
    expect(r.ate).toBe(true);
    expect(r.hunger).toBe(BITE_HUNGER);
    expect(c.bitesRemaining).toBe(FRESH_BITES - 1);
  });

  it('full hunger still allows eat (wiki: cake bypasses fullness)', () => {
    // Wiki: "Unlike most foods, cake can be eaten with a full hunger bar."
    const c = makeCake();
    const r = eat(c, 20);
    expect(r.ate).toBe(true);
    expect(c.bitesRemaining).toBe(FRESH_BITES - 1);
  });

  it('removes on last bite', () => {
    const c = makeCake();
    let r: ReturnType<typeof eat> = { ate: false, hunger: 0, saturation: 0, remove: false };
    for (let i = 0; i < FRESH_BITES; i++) r = eat(c, 0);
    expect(r.remove).toBe(true);
  });

  it('empty cake flagged remove', () => {
    expect(eat({ bitesRemaining: 0 }, 0).remove).toBe(true);
  });

  it('extinguish candle', () => {
    expect(extinguishCandleOnCake(true)).toBe(true);
    expect(extinguishCandleOnCake(false)).toBe(false);
  });
});
