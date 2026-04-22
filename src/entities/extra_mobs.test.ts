import { describe, it, expect } from 'vitest';
import { EXTRA_MOB_DEFS, registerExtraMobs } from './extra_mobs';
import { MOB_DEFS } from './mob';

describe('extra mobs', () => {
  it('has 27 additional mob defs', () => {
    expect(Object.keys(EXTRA_MOB_DEFS).length).toBe(27);
  });

  it('ravager has the highest HP', () => {
    const ravager = EXTRA_MOB_DEFS.ravager.maxHealth;
    for (const [k, def] of Object.entries(EXTRA_MOB_DEFS)) {
      if (k === 'ravager') continue;
      expect(def.maxHealth).toBeLessThanOrEqual(ravager);
    }
  });

  it('registers into the global MOB_DEFS map', () => {
    registerExtraMobs();
    expect(MOB_DEFS['phantom' as keyof typeof MOB_DEFS]).toBeDefined();
    expect(MOB_DEFS['breeze' as keyof typeof MOB_DEFS]).toBeDefined();
  });

  it('every def has a positive maxHealth', () => {
    for (const [name, def] of Object.entries(EXTRA_MOB_DEFS)) {
      expect(def.maxHealth, name).toBeGreaterThan(0);
    }
  });

  it('passive / hostile / neutral coverage', () => {
    const behaviors = new Set(Object.values(EXTRA_MOB_DEFS).map((d) => d.behavior));
    expect(behaviors.has('passive')).toBe(true);
    expect(behaviors.has('hostile')).toBe(true);
    expect(behaviors.has('neutral')).toBe(true);
  });
});
