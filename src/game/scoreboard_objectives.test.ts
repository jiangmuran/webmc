import { describe, it, expect } from 'vitest';
import {
  createBoard,
  addObjective,
  setScore,
  getScore,
  sidebarLines,
} from './scoreboard_objectives';

describe('scoreboard objectives', () => {
  it('empty board', () => {
    expect(createBoard().objectives.size).toBe(0);
  });

  it('add objective registers', () => {
    const b = createBoard();
    addObjective(b, { name: 'kills', criterion: 'dummy', displayName: 'Kills' });
    expect(b.objectives.has('kills')).toBe(true);
  });

  it('set and get score', () => {
    const b = createBoard();
    addObjective(b, { name: 'kills', criterion: 'dummy', displayName: 'Kills' });
    setScore(b, 'kills', 'alice', 7);
    expect(getScore(b, 'kills', 'alice')).toBe(7);
  });

  it('set on unknown objective noop', () => {
    const b = createBoard();
    setScore(b, 'nope', 'x', 1);
    expect(getScore(b, 'nope', 'x')).toBeUndefined();
  });

  it('sidebar lines sorted desc', () => {
    const b = createBoard();
    addObjective(b, { name: 'kills', criterion: 'dummy', displayName: 'Kills' });
    setScore(b, 'kills', 'alice', 5);
    setScore(b, 'kills', 'bob', 10);
    b.displays.set('sidebar', 'kills');
    const lines = sidebarLines(b);
    expect(lines[0]?.[0]).toBe('bob');
    expect(lines[0]?.[1]).toBe(10);
  });

  it('no sidebar obj → empty', () => {
    expect(sidebarLines(createBoard())).toEqual([]);
  });
});
