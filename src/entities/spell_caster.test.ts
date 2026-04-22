import { describe, it, expect } from 'vitest';
import { SPELL_DEFS, beginSpell, makeCaster, tickCaster } from './spell_caster';

describe('spell caster', () => {
  it('5 spells defined', () => {
    expect(Object.keys(SPELL_DEFS).length).toBe(5);
  });

  it('begin → warmup → fire', () => {
    const c = makeCaster();
    beginSpell(c, { spell: 'fangs' });
    let fired: string | null = null;
    for (let i = 0; i < 20; i++) {
      const r = tickCaster(c, { dtSec: 0.1 });
      if (r.fired) {
        fired = r.fired;
        break;
      }
    }
    expect(fired).toBe('fangs');
  });

  it('cooldown blocks immediate re-cast', () => {
    const c = makeCaster();
    beginSpell(c, { spell: 'fangs' });
    for (let i = 0; i < 20; i++) tickCaster(c, { dtSec: 0.1 });
    const r = beginSpell(c, { spell: 'fangs' });
    expect(r.started).toBe(false);
  });

  it('cannot queue multiple spells', () => {
    const c = makeCaster();
    beginSpell(c, { spell: 'summon_vex' });
    expect(beginSpell(c, { spell: 'fangs' }).started).toBe(false);
  });
});
