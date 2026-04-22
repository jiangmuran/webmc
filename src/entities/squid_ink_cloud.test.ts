import { describe, it, expect } from 'vitest';
import { makeSquid, shedInk, inkSacDrops, MAX_INK, INK_COOLDOWN_TICKS } from './squid_ink_cloud';

describe('squid ink', () => {
  it('sheds ink', () => {
    const s = makeSquid(false);
    const r = shedInk(s, 0);
    expect(r.emitted).toBe(true);
    expect(s.inkReserves).toBe(MAX_INK - 1);
  });

  it('cooldown blocks repeat', () => {
    const s = makeSquid(false);
    shedInk(s, 0);
    expect(shedInk(s, 10).emitted).toBe(false);
    expect(shedInk(s, INK_COOLDOWN_TICKS + 1).emitted).toBe(true);
  });

  it('empty reserves = no ink', () => {
    const s = makeSquid(false);
    for (let i = 0; i < MAX_INK; i++) shedInk(s, i * (INK_COOLDOWN_TICKS + 1));
    expect(shedInk(s, 10_000).emitted).toBe(false);
  });

  it('glow squid emits glow', () => {
    const s = makeSquid(true);
    const r = shedInk(s, 0);
    expect(r.glow).toBe(true);
    expect(r.radius).toBe(4);
  });

  it('drops 1..3', () => {
    for (let r = 0; r < 10; r++) {
      const d = inkSacDrops(() => r / 10);
      expect(d).toBeGreaterThanOrEqual(1);
      expect(d).toBeLessThanOrEqual(3);
    }
  });
});
