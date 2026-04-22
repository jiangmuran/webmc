import { describe, it, expect } from 'vitest';
import { makeWarden, damageWarden, regenIfCalm, WARDEN_MAX_HP } from './warden_hp_scaling';

describe('warden hp', () => {
  it('max 500', () => {
    expect(makeWarden().hp).toBe(WARDEN_MAX_HP);
  });

  it('fire/lava no damage', () => {
    const w = makeWarden();
    expect(damageWarden(w, { amount: 100, kind: 'fire' })).toBe(0);
    expect(damageWarden(w, { amount: 100, kind: 'lava' })).toBe(0);
  });

  it('melee damages', () => {
    const w = makeWarden();
    const before = w.hp;
    damageWarden(w, { amount: 10, kind: 'melee' });
    expect(w.hp).toBe(before - 10);
  });

  it('regen when calm', () => {
    const w = { hp: 100, maxHp: WARDEN_MAX_HP };
    const h = regenIfCalm(w, 300, 200);
    expect(h).toBeGreaterThan(0);
    expect(w.hp).toBe(100 + h);
  });

  it('no regen if recently agitated', () => {
    const w = { hp: 100, maxHp: WARDEN_MAX_HP };
    expect(regenIfCalm(w, 50, 200)).toBe(0);
  });
});
