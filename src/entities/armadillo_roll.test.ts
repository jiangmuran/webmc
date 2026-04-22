import { describe, it, expect } from 'vitest';
import { armadilloTakeDamage, makeArmadilloRollState, tickArmadilloRoll } from './armadillo_roll';

describe('armadillo roll', () => {
  it('rolls when threatened', () => {
    const s = makeArmadilloRollState();
    const r = tickArmadilloRoll(s, {
      nearbyHostile: true,
      recentlyDamaged: false,
      playerSprintingNearby: false,
      dtSec: 0.1,
    });
    expect(r.stateChanged).toBe(true);
    expect(s.rolled).toBe(true);
  });

  it('unrolls after threat leaves + delay', () => {
    const s = makeArmadilloRollState();
    tickArmadilloRoll(s, {
      nearbyHostile: true,
      recentlyDamaged: false,
      playerSprintingNearby: false,
      dtSec: 0.1,
    });
    // wait cooldown + unroll
    tickArmadilloRoll(s, {
      nearbyHostile: false,
      recentlyDamaged: false,
      playerSprintingNearby: false,
      dtSec: 3,
    });
    expect(s.rolled).toBe(false);
  });

  it('rolled armadillo ignores melee damage', () => {
    expect(armadilloTakeDamage({ rolled: true, incoming: 5, source: 'melee' })).toBe(0);
  });

  it('rolled armadillo still takes projectile damage', () => {
    expect(armadilloTakeDamage({ rolled: true, incoming: 5, source: 'projectile' })).toBe(5);
  });

  it('unrolled armadillo takes all damage', () => {
    expect(armadilloTakeDamage({ rolled: false, incoming: 3, source: 'melee' })).toBe(3);
  });

  it('player sprint nearby is a threat', () => {
    const s = makeArmadilloRollState();
    tickArmadilloRoll(s, {
      nearbyHostile: false,
      recentlyDamaged: false,
      playerSprintingNearby: true,
      dtSec: 0.1,
    });
    expect(s.rolled).toBe(true);
  });
});
