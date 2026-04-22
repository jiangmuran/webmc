import { describe, it, expect } from 'vitest';
import { applyBadOmen, drinkOminousBottle, tryStartRaid } from './ominous_bottle';

describe('ominous bottle / bad omen', () => {
  it('applying level 1 → amplifier 0', () => {
    const o = applyBadOmen(null, 1);
    expect(o.amplifier).toBe(0);
    expect(o.remainingSec).toBeGreaterThan(0);
  });

  it('cap at amplifier 4', () => {
    const o = applyBadOmen(null, 99);
    expect(o.amplifier).toBe(4);
  });

  it('stronger overrides weaker', () => {
    const first = applyBadOmen(null, 1);
    const stronger = applyBadOmen(first, 3);
    expect(stronger.amplifier).toBe(2);
  });

  it('drinking ominous bottle yields trial omen', () => {
    const t = drinkOminousBottle(3);
    expect(t.amplifier).toBe(2);
    expect(t.remainingSec).toBeGreaterThan(0);
  });

  it('entering village with bad omen triggers raid', () => {
    const omen = applyBadOmen(null, 2);
    const r = tryStartRaid(true, omen);
    expect(r.startRaid).toBe(true);
    expect(r.level).toBe(2);
  });

  it('not in village → no raid', () => {
    const omen = applyBadOmen(null, 1);
    expect(tryStartRaid(false, omen).startRaid).toBe(false);
  });
});
