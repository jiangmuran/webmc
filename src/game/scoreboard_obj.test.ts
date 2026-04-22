import { describe, it, expect } from 'vitest';
import { Scoreboard } from './scoreboard_obj';

describe('scoreboard', () => {
  it('add + set + get', () => {
    const s = new Scoreboard();
    s.addObjective({ id: 'kills', displayName: 'Kills', criterion: 'playerKills' });
    s.setScore('kills', 'Steve', 3);
    expect(s.getScore('kills', 'Steve')).toBe(3);
  });

  it('increment', () => {
    const s = new Scoreboard();
    s.addObjective({ id: 'x', displayName: 'X', criterion: 'dummy' });
    s.increment('x', 'A');
    s.increment('x', 'A', 5);
    expect(s.getScore('x', 'A')).toBe(6);
  });

  it('remove clears display', () => {
    const s = new Scoreboard();
    s.addObjective({ id: 'x', displayName: 'X', criterion: 'dummy' });
    s.setDisplay('sidebar', 'x');
    s.removeObjective('x');
    expect(s.displayedFor('sidebar')).toBeNull();
  });

  it('sidebar sorted', () => {
    const s = new Scoreboard();
    s.addObjective({ id: 'x', displayName: 'X', criterion: 'dummy' });
    s.setScore('x', 'A', 10);
    s.setScore('x', 'B', 5);
    s.setScore('x', 'C', 20);
    s.setDisplay('sidebar', 'x');
    const rows = s.sidebarEntries();
    expect(rows.map((r) => r.player)).toEqual(['C', 'A', 'B']);
  });

  it('duplicate add rejected', () => {
    const s = new Scoreboard();
    s.addObjective({ id: 'x', displayName: 'X', criterion: 'dummy' });
    expect(s.addObjective({ id: 'x', displayName: 'Y', criterion: 'dummy' })).toBe(false);
  });
});
