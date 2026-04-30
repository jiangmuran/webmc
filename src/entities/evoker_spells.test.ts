import { describe, it, expect } from 'vitest';
import { makeEvoker, canCast, pickSpell, SPELL_COOLDOWN_MS, VEX_NEARBY_CAP } from './evoker_spells';

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

  it('vex cap is 8 (wiki: fewer than eight vexes in 16 blocks)', () => {
    expect(VEX_NEARBY_CAP).toBe(8);
    // At-cap: fangs_line is the only available offensive spell.
    const s = makeEvoker();
    s.lastCastMs.fangs_line = 0; // put fangs on cooldown so summon_vex would be the candidate if not capped
    const atCap = pickSpell(s, {
      nowMs: 100,
      rand: () => 0,
      sheepNearby: false,
      enemyNearby: true,
      vexCount: VEX_NEARBY_CAP,
    });
    expect(atCap).toBeNull();
    // Below-cap with fangs on cooldown: summon_vex is the only candidate.
    const s2 = makeEvoker();
    s2.lastCastMs.fangs_line = 0;
    const belowCap = pickSpell(s2, {
      nowMs: 100,
      rand: () => 0,
      sheepNearby: false,
      enemyNearby: true,
      vexCount: VEX_NEARBY_CAP - 1,
    });
    expect(belowCap).toBe('summon_vex');
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
