import { describe, it, expect } from 'vitest';
import { sameTeam, canDamage, canSeeInvisible, type Team } from './team_friendly_fire';

const red: Team = {
  name: 'red',
  members: new Set(['alice', 'bob']),
  friendlyFire: false,
  seeInvisibleTeammates: true,
};

describe('team friendly fire', () => {
  it('same team detected', () => {
    expect(sameTeam(red, 'alice', 'bob')).toBe(true);
  });

  it('non-member not in team', () => {
    expect(sameTeam(red, 'alice', 'eve')).toBe(false);
  });

  it('blocks friendly damage', () => {
    expect(canDamage(red, 'alice', 'bob')).toBe(false);
  });

  it('allows opponent damage', () => {
    expect(canDamage(red, 'alice', 'eve')).toBe(true);
  });

  it('ff on allows damage', () => {
    expect(canDamage({ ...red, friendlyFire: true }, 'alice', 'bob')).toBe(true);
  });

  it('no team anyone hits', () => {
    expect(canDamage(undefined, 'x', 'y')).toBe(true);
  });

  it('see invisible teammates', () => {
    expect(canSeeInvisible(red, 'alice', 'bob')).toBe(true);
  });

  it('cannot see invisible enemy', () => {
    expect(canSeeInvisible(red, 'alice', 'eve')).toBe(false);
  });
});
