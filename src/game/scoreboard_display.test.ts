import { describe, it, expect } from 'vitest';
import { DisplayRegistry } from './scoreboard_display';

describe('scoreboard display', () => {
  it('assigns objective to slot', () => {
    const d = new DisplayRegistry();
    d.setObjective('sidebar', 'kills');
    expect(d.objectiveFor('sidebar')).toBe('kills');
  });

  it('null clears slot', () => {
    const d = new DisplayRegistry();
    d.setObjective('sidebar', 'kills');
    d.setObjective('sidebar', null);
    expect(d.objectiveFor('sidebar')).toBeNull();
  });

  it('team-colored sidebars are independent', () => {
    const d = new DisplayRegistry();
    d.setObjective('sidebar_team_red', 'red_score');
    d.setObjective('sidebar_team_blue', 'blue_score');
    expect(d.objectiveFor('sidebar_team_red')).toBe('red_score');
    expect(d.objectiveFor('sidebar_team_blue')).toBe('blue_score');
  });

  it('allAssignments lists all', () => {
    const d = new DisplayRegistry();
    d.setObjective('list', 'deaths');
    d.setObjective('sidebar', 'kills');
    expect(d.allAssignments().length).toBe(2);
  });
});
