import { describe, it, expect } from 'vitest';
import { entityStep, lavaCauldronIgnites } from './cauldron_water_entity';

describe('cauldron water', () => {
  it('extinguishes on-fire entity', () => {
    const c = { content: 'water' as const, level: 3 as 0 | 1 | 2 | 3 };
    const r = entityStep(c, { isOnFire: true, hasLeatherArmor: false, leatherColor: null });
    expect(r.extinguishedFire).toBe(true);
    expect(c.level).toBe(2);
  });

  it('washes dyed leather', () => {
    const c = { content: 'water' as const, level: 3 as 0 | 1 | 2 | 3 };
    const r = entityStep(c, {
      isOnFire: false,
      hasLeatherArmor: true,
      leatherColor: 'red',
    });
    expect(r.washedArmor).toBe(true);
  });

  it('empty cauldron no-op', () => {
    const c = { content: 'empty' as const, level: 0 as 0 | 1 | 2 | 3 };
    const r = entityStep(c, { isOnFire: true, hasLeatherArmor: false, leatherColor: null });
    expect(r.extinguishedFire).toBe(false);
  });

  it('lava cauldron ignites', () => {
    expect(lavaCauldronIgnites({ standingInLavaCauldron: true })).toBe(true);
  });
});
