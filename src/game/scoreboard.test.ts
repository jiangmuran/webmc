import { describe, it, expect } from 'vitest';
import { Scoreboard } from './scoreboard';

describe('Scoreboard', () => {
  it('objectives track per-player scores', () => {
    const s = new Scoreboard();
    s.addObjective({ id: 'kills', displayName: 'Kills', criteria: 'mobs_killed' });
    s.addScore('kills', 'alice', 3);
    s.addScore('kills', 'bob', 1);
    expect(s.getScore('kills', 'alice')).toBe(3);
    expect(s.getScore('kills', 'bob')).toBe(1);
  });

  it('topScores returns sorted leaderboard', () => {
    const s = new Scoreboard();
    s.addObjective({ id: 'kills', displayName: 'Kills', criteria: 'mobs_killed' });
    s.addScore('kills', 'a', 5);
    s.addScore('kills', 'b', 10);
    s.addScore('kills', 'c', 2);
    const top = s.topScores('kills');
    expect(top[0]?.player).toBe('b');
    expect(top[2]?.player).toBe('c');
  });

  it('teams control friendly-fire', () => {
    const s = new Scoreboard();
    s.addTeam({
      id: 'red',
      displayName: 'Red',
      color: '#f00',
      friendlyFire: false,
      seeFriendlyInvisibles: false,
    });
    s.assignPlayer('red', 'alice');
    s.assignPlayer('red', 'bob');
    expect(s.canDamage('alice', 'bob')).toBe(false);
  });

  it('cross-team damage is allowed', () => {
    const s = new Scoreboard();
    s.addTeam({
      id: 'red',
      displayName: 'Red',
      color: '#f00',
      friendlyFire: false,
      seeFriendlyInvisibles: false,
    });
    s.addTeam({
      id: 'blue',
      displayName: 'Blue',
      color: '#00f',
      friendlyFire: false,
      seeFriendlyInvisibles: false,
    });
    s.assignPlayer('red', 'alice');
    s.assignPlayer('blue', 'bob');
    expect(s.canDamage('alice', 'bob')).toBe(true);
  });

  it('assign moves players between teams cleanly', () => {
    const s = new Scoreboard();
    s.addTeam({
      id: 'red',
      displayName: 'Red',
      color: '#f00',
      friendlyFire: false,
      seeFriendlyInvisibles: false,
    });
    s.addTeam({
      id: 'blue',
      displayName: 'Blue',
      color: '#00f',
      friendlyFire: false,
      seeFriendlyInvisibles: false,
    });
    s.assignPlayer('red', 'alice');
    s.assignPlayer('blue', 'alice');
    expect(s.teamOf('alice')?.id).toBe('blue');
  });

  it('removeTeam cleans up membership', () => {
    const s = new Scoreboard();
    s.addTeam({
      id: 'red',
      displayName: 'Red',
      color: '#f00',
      friendlyFire: false,
      seeFriendlyInvisibles: false,
    });
    s.assignPlayer('red', 'alice');
    s.removeTeam('red');
    expect(s.teamOf('alice')).toBeNull();
  });
});
