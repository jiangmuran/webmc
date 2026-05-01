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

  it('unrolls after 3 seconds of no threat (wiki)', () => {
    const s = makeArmadilloRollState();
    tickArmadilloRoll(s, {
      nearbyHostile: true,
      recentlyDamaged: false,
      playerSprintingNearby: false,
      dtSec: 0.1,
    });
    // 2.9 seconds — still rolled per wiki's 3-second threshold
    tickArmadilloRoll(s, {
      nearbyHostile: false,
      recentlyDamaged: false,
      playerSprintingNearby: false,
      dtSec: 2.9,
    });
    expect(s.rolled).toBe(true);
    // Crossing the 3-second mark unrolls.
    tickArmadilloRoll(s, {
      nearbyHostile: false,
      recentlyDamaged: false,
      playerSprintingNearby: false,
      dtSec: 0.2,
    });
    expect(s.rolled).toBe(false);
  });

  it('rolled armadillo damage = (incoming - 1) / 2 (wiki, melee)', () => {
    // 6 → (6-1)/2 = 2.5
    expect(armadilloTakeDamage({ rolled: true, incoming: 6, source: 'melee' })).toBe(2.5);
  });

  it('rolled formula applies to projectiles too (wiki: uniform)', () => {
    // 5 → (5-1)/2 = 2
    expect(armadilloTakeDamage({ rolled: true, incoming: 5, source: 'projectile' })).toBe(2);
  });

  it('rolled formula applies to explosion (wiki: uniform in JE)', () => {
    // 9 → (9-1)/2 = 4
    expect(armadilloTakeDamage({ rolled: true, incoming: 9, source: 'explosion' })).toBe(4);
  });

  it('rolled clamps at 0 for ≤1 damage', () => {
    expect(armadilloTakeDamage({ rolled: true, incoming: 1, source: 'melee' })).toBe(0);
    expect(armadilloTakeDamage({ rolled: true, incoming: 0.5, source: 'melee' })).toBe(0);
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
