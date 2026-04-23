import { describe, it, expect } from 'vitest';
import { sameTeam, canAttack } from './team_color_ffa';

describe('team color ffa', () => {
  it('same team detection', () => {
    expect(sameTeam({ playerId: 'a', team: 'red' }, { playerId: 'b', team: 'red' })).toBe(true);
  });

  it('none team never same', () => {
    expect(sameTeam({ playerId: 'a', team: 'none' }, { playerId: 'b', team: 'none' })).toBe(false);
  });

  it('same team blocks attack without FF', () => {
    expect(canAttack({ playerId: 'a', team: 'red' }, { playerId: 'b', team: 'red' }, false)).toBe(
      false,
    );
  });

  it('enemy team attackable', () => {
    expect(canAttack({ playerId: 'a', team: 'red' }, { playerId: 'b', team: 'blue' }, false)).toBe(
      true,
    );
  });

  it('self never attackable', () => {
    expect(canAttack({ playerId: 'a', team: 'red' }, { playerId: 'a', team: 'red' }, true)).toBe(
      false,
    );
  });
});
