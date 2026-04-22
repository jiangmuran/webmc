import { describe, it, expect } from 'vitest';
import { crackTier, repair, dropsOnDeath, IRON_REPAIR } from './iron_golem_cracks_render';

describe('iron golem cracks', () => {
  it('none at full hp', () => {
    expect(crackTier({ hp: 100, maxHp: 100 })).toBe('none');
  });

  it('tiers at 50/25', () => {
    expect(crackTier({ hp: 60, maxHp: 100 })).toBe('low');
    expect(crackTier({ hp: 40, maxHp: 100 })).toBe('medium');
    expect(crackTier({ hp: 10, maxHp: 100 })).toBe('high');
  });

  it('repair', () => {
    const g = { hp: 10, maxHp: 100 };
    expect(repair(g)).toBe(true);
    expect(g.hp).toBe(10 + IRON_REPAIR);
  });

  it('no repair at full', () => {
    const g = { hp: 100, maxHp: 100 };
    expect(repair(g)).toBe(false);
  });

  it('drops', () => {
    const d = dropsOnDeath(() => 0.5);
    expect(d.find((x) => x.id === 'webmc:iron_ingot')).toBeTruthy();
  });
});
