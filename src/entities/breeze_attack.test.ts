import { describe, it, expect } from 'vitest';
import { chooseAttack, immuneTo, BREEZE_ATTACK_COOLDOWN_TICKS } from './breeze_attack';

describe('breeze attack', () => {
  it('out of range idle', () => {
    expect(
      chooseAttack({ distanceToTarget: 100, canSeeTarget: true, cooldownRemaining: 0 }),
    ).toEqual({
      kind: 'idle',
    });
  });

  it('sight range is 16 blocks (wiki)', () => {
    // 17 = out of range, 16 = at edge (in range, fires).
    expect(
      chooseAttack({ distanceToTarget: 17, canSeeTarget: true, cooldownRemaining: 0 }),
    ).toEqual({ kind: 'idle' });
    expect(
      chooseAttack({ distanceToTarget: 16, canSeeTarget: true, cooldownRemaining: 0 }).kind,
    ).toBe('wind_charge');
  });

  it('attack cooldown is 32 ticks = 1.6s (wiki)', () => {
    expect(BREEZE_ATTACK_COOLDOWN_TICKS).toBe(32);
  });

  it('no sight idle', () => {
    expect(
      chooseAttack({ distanceToTarget: 5, canSeeTarget: false, cooldownRemaining: 0 }),
    ).toEqual({
      kind: 'idle',
    });
  });

  it('hop away when close', () => {
    expect(chooseAttack({ distanceToTarget: 2, canSeeTarget: true, cooldownRemaining: 0 })).toEqual(
      {
        kind: 'hop_away',
      },
    );
  });

  it('fires wind charge', () => {
    const r = chooseAttack({ distanceToTarget: 10, canSeeTarget: true, cooldownRemaining: 0 });
    expect(r).toEqual({ kind: 'wind_charge', cooldownTicks: BREEZE_ATTACK_COOLDOWN_TICKS });
  });

  it('waits on cooldown', () => {
    expect(
      chooseAttack({ distanceToTarget: 10, canSeeTarget: true, cooldownRemaining: 20 }),
    ).toEqual({
      kind: 'idle',
    });
  });

  it('immunities', () => {
    expect(immuneTo('wind_charge')).toBe(true);
    expect(immuneTo('fall')).toBe(true);
    expect(immuneTo('fire')).toBe(false);
  });
});
