import { describe, it, expect } from 'vitest';
import { crackTier, damageIronGolem, makeIronGolem, repairIronGolem } from './iron_golem_cracks';

describe('iron golem cracks', () => {
  it('starts uncracked', () => {
    expect(crackTier(makeIronGolem())).toBe('none');
  });

  it('progresses through crack tiers', () => {
    const g = makeIronGolem();
    damageIronGolem(g, 30);
    expect(crackTier(g)).toBe('minor');
    damageIronGolem(g, 25);
    expect(crackTier(g)).toBe('moderate');
    damageIronGolem(g, 25);
    expect(crackTier(g)).toBe('severe');
  });

  it('iron ingot heals 25 HP', () => {
    const g = makeIronGolem();
    damageIronGolem(g, 75);
    const consumed = repairIronGolem(g, 2);
    expect(g.hp).toBe(75);
    expect(consumed).toBe(2);
  });

  it('repair caps at max HP', () => {
    const g = makeIronGolem();
    damageIronGolem(g, 10);
    const consumed = repairIronGolem(g, 5);
    expect(g.hp).toBe(100);
    expect(consumed).toBe(1);
  });
});
