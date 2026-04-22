import { describe, it, expect } from 'vitest';
import { makeEvoker, canCast, pickSpell, SPELL_COOLDOWN_MS } from './evoker_spells';

describe('evoker', () => {
  it('cast once then cooldown', () => {
    const s = makeEvoker();
    expect(canCast(s, 'fangs_line', 0)).toBe(true);
    s.lastCastMs.fangs_line = 0;
    expect(canCast(s, 'fangs_line', 100)).toBe(false);
    expect(canCast(s, 'fangs_line', SPELL_COOLDOWN_MS.fangs_line + 1)).toBe(true);
  });

  it('picks wololo for sheep', () => {
    const s = makeEvoker();
    const pick = pickSpell(s, {
      nowMs: 100,
      rand: () => 0,
      sheepNearby: true,
      enemyNearby: false,
      vexCount: 3,
    });
    expect(pick).toBe('wololo');
  });

  it('no candidates = null', () => {
    const s = makeEvoker();
    expect(
      pickSpell(s, {
        nowMs: 0,
        rand: () => 0,
        sheepNearby: false,
        enemyNearby: false,
        vexCount: 3,
      }),
    ).toBeNull();
  });

  it('vex cap respected', () => {
    const s = makeEvoker();
    const pick = pickSpell(s, {
      nowMs: 0,
      rand: () => 0,
      sheepNearby: false,
      enemyNearby: false,
      vexCount: 3,
    });
    expect(pick).not.toBe('summon_vex');
  });

  it('pick throttled', () => {
    const s = makeEvoker();
    pickSpell(s, {
      nowMs: 0,
      rand: () => 0,
      sheepNearby: true,
      enemyNearby: false,
      vexCount: 3,
    });
    expect(
      pickSpell(s, {
        nowMs: 100,
        rand: () => 0,
        sheepNearby: true,
        enemyNearby: false,
        vexCount: 3,
      }),
    ).toBeNull();
  });
});
