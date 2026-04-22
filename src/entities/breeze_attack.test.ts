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
