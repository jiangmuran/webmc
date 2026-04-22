import { describe, it, expect } from 'vitest';
import { TeamRegistry } from './team';

describe('team registry', () => {
  it('creates teams', () => {
    const r = new TeamRegistry();
    const t = r.createTeam('red', { color: 'red' });
    expect(t.options.color).toBe('red');
  });

  it('rejects duplicate team name', () => {
    const r = new TeamRegistry();
    r.createTeam('red');
    expect(() => r.createTeam('red')).toThrow();
  });

  it('addMember moves from prior team', () => {
    const r = new TeamRegistry();
    r.createTeam('red');
    r.createTeam('blue');
    r.addMember('red', 'p1');
    r.addMember('blue', 'p1');
    expect(r.teamOf('p1')?.name).toBe('blue');
  });

  it('sameTeam true for teammates', () => {
    const r = new TeamRegistry();
    r.createTeam('red');
    r.addMember('red', 'p1');
    r.addMember('red', 'p2');
    expect(r.sameTeam('p1', 'p2')).toBe(true);
  });

  it('different teams cannot accidentally be "same"', () => {
    const r = new TeamRegistry();
    r.createTeam('red');
    r.createTeam('blue');
    r.addMember('red', 'p1');
    r.addMember('blue', 'p2');
    expect(r.sameTeam('p1', 'p2')).toBe(false);
  });

  it('friendly-fire off blocks same-team damage', () => {
    const r = new TeamRegistry();
    r.createTeam('red', { friendlyFire: false });
    r.addMember('red', 'p1');
    r.addMember('red', 'p2');
    expect(r.canDamage('p1', 'p2')).toBe(false);
  });

  it('cross-team damage always allowed', () => {
    const r = new TeamRegistry();
    r.createTeam('red', { friendlyFire: false });
    r.createTeam('blue', { friendlyFire: false });
    r.addMember('red', 'p1');
    r.addMember('blue', 'p2');
    expect(r.canDamage('p1', 'p2')).toBe(true);
  });

  it('removeTeam clears memberships', () => {
    const r = new TeamRegistry();
    r.createTeam('red');
    r.addMember('red', 'p1');
    r.removeTeam('red');
    expect(r.teamOf('p1')).toBeNull();
  });
});
