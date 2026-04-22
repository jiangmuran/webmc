import { describe, it, expect } from 'vitest';
import { MOB_DEFS, type MobKind } from './mob';

describe('MOB_DEFS — M18 roster breadth', () => {
  const newKinds: MobKind[] = [
    'pillager',
    'vindicator',
    'evoker',
    'iron_golem',
    'snow_golem',
    'bee',
    'axolotl',
    'frog',
    'warden',
    'fox',
    'goat',
    'horse',
    'rabbit',
    'squid',
    'cat',
    'parrot',
  ];

  it('every new mob has a def with positive max health', () => {
    for (const k of newKinds) {
      const def = MOB_DEFS[k];
      expect(def, `missing ${k}`).toBeDefined();
      expect(def.maxHealth).toBeGreaterThan(0);
    }
  });

  it('warden is the highest-HP mob in the roster', () => {
    const warden = MOB_DEFS.warden.maxHealth;
    for (const k of Object.keys(MOB_DEFS) as MobKind[]) {
      if (k === 'warden') continue;
      expect(MOB_DEFS[k].maxHealth).toBeLessThanOrEqual(warden);
    }
  });

  it('iron_golem is neutral (defends, not aggresses)', () => {
    expect(MOB_DEFS.iron_golem.behavior).toBe('neutral');
  });

  it('goat has jumpVelocity set (goats jump)', () => {
    expect(MOB_DEFS.goat.jumpVelocity).toBeDefined();
  });
});
